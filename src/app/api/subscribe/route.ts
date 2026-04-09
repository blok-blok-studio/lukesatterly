import { Resend } from "resend";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { welcomeEmail } from "@/lib/emails";
import { buildUnsubscribeUrl } from "@/lib/unsubscribe";

// ─────────── CONSTANTS ───────────
// Hard caps to prevent DoS / DB bloat. Tune if needed.
const MAX_BODY_BYTES = 4096; // 4 KB is plenty for name+email+goal
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254; // RFC 5321
const MAX_FIELD_LENGTH = 200;

// Rate limiting: 5 submissions per IP per 10 minutes.
// In-memory store (resets on cold start). For multi-region scale, swap for
// Upstash Redis, but this is enough for Luke's traffic profile.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

// Periodic cleanup so the Map doesn't grow unbounded
function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) rateLimitStore.delete(ip);
  }
}

// ─────────── VALIDATION ───────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .slice(0, maxLength)
    // Strip control characters and null bytes
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, "")
    // Neutralize any HTML-like syntax stored in DB (defense-in-depth; React
    // escapes on render, but the DB and outbound emails get extra safety).
    .replace(/[<>]/g, "");
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  return new Resend(key);
}

// ─────────── HANDLER ───────────
export async function POST(request: Request) {
  try {
    // 1. Origin check — reject cross-site form submissions.
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      "https://coachluki.com",
      "https://www.coachluki.com",
      "http://localhost:3000",
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Rate limit per IP
    const ip = getClientIp(request);
    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfter ?? 600) },
        }
      );
    }
    if (rateLimitStore.size > 1000) cleanupRateLimit();

    // 3. Reject oversized bodies
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    // 4. Parse body defensively
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid body" }, { status: 400 });
    }

    const raw = body as Record<string, unknown>;

    // 5. Sanitize & validate each field
    const name = sanitizeString(raw.name, MAX_NAME_LENGTH);
    const email = sanitizeString(raw.email, MAX_EMAIL_LENGTH).toLowerCase();
    const goal = sanitizeString(raw.goal, MAX_FIELD_LENGTH);
    const preference = sanitizeString(raw.preference, MAX_FIELD_LENGTH);
    const timeline = sanitizeString(raw.timeline, MAX_FIELD_LENGTH);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // 6. Persist
    const subscriber = await prisma.subscriber.upsert({
      where: { email },
      update: { name, goal, preference, timeline },
      create: {
        email,
        name,
        goal,
        preference,
        timeline,
        sequenceStep: 0,
      },
    });

    // 7. Welcome email (sequence step 0 → 1)
    const resend = getResend();
    if (resend && subscriber.sequenceStep === 0) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const replyToEmail = process.env.RESEND_REPLY_TO || "luke.satterly@icloud.com";
      const firstName = name.split(" ")[0];

      // Build per-subscriber unsubscribe URL (HMAC-signed, no DB lookup needed)
      const unsubscribeUrl = buildUnsubscribeUrl(email);
      const { html, text } = welcomeEmail(firstName, unsubscribeUrl, timeline);

      await resend.emails.send({
        from: `Coach Luki <${fromEmail}>`,
        replyTo: replyToEmail,
        to: email,
        subject: "Your workout template is ready",
        html,
        text,
        // RFC 8058 one-click unsubscribe — required by Gmail bulk sender
        // guidelines (Feb 2024) to avoid being flagged as spam.
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${replyToEmail}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      });

      const audienceId = process.env.RESEND_AUDIENCE_ID;
      if (audienceId) {
        await resend.contacts.create({
          audienceId,
          email,
          firstName,
          lastName: name.split(" ").slice(1).join(" ") || undefined,
          unsubscribed: false,
        });
      }

      await prisma.subscriber.update({
        where: { id: subscriber.id },
        data: { sequenceStep: 1, lastEmailAt: new Date() },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Log server-side only — don't leak details to client
    console.error("Subscribe error:", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
