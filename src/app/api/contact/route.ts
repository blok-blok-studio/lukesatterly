import { Resend } from "resend";
import { NextResponse } from "next/server";
import { contactConfirmationEmail } from "@/lib/emails";

// ─────────── CONSTANTS ───────────
const MAX_BODY_BYTES = 4096;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_FIELD_LENGTH = 500; // message can be longer

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 3;
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

function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) rateLimitStore.delete(ip);
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function sanitizeString(input: unknown, maxLength: number): string {
  if (typeof input !== "string") return "";
  return input
    .trim()
    .slice(0, maxLength)
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F\x7F]/g, "")
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

export async function POST(request: Request) {
  try {
    // 1. Origin check
    const origin = request.headers.get("origin");
    const allowedOrigins = [
      "https://coachluki.com",
      "https://www.coachluki.com",
      "http://localhost:3000",
    ];
    if (origin && !allowedOrigins.includes(origin)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Rate limit
    const ip = getClientIp(request);
    const limit = checkRateLimit(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter ?? 600) } }
      );
    }
    if (rateLimitStore.size > 1000) cleanupRateLimit();

    // 3. Reject oversized bodies
    const contentLength = Number(request.headers.get("content-length") || "0");
    if (contentLength > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    // 4. Parse body
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

    // 5. Sanitize & validate
    const name = sanitizeString(raw.name, MAX_NAME_LENGTH);
    const email = sanitizeString(raw.email, MAX_EMAIL_LENGTH).toLowerCase();
    const goal = sanitizeString(raw.goal, MAX_FIELD_LENGTH);
    const message = sanitizeString(raw.message, MAX_FIELD_LENGTH);

    if (!name || name.length < 2) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const resend = getResend();
    if (!resend) {
      return NextResponse.json({ error: "Email not configured" }, { status: 500 });
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
    const replyToEmail = process.env.RESEND_REPLY_TO || "luke.satterly@icloud.com";
    const firstName = name.split(" ")[0];

    // 6. Send confirmation to the person who submitted the form
    const { html, text } = contactConfirmationEmail(firstName);

    await resend.emails.send({
      from: `Coach Luki <${fromEmail}>`,
      replyTo: replyToEmail,
      to: email,
      subject: "Got your message — I'll be in touch",
      html,
      text,
    });

    // 7. Notify Luke about the new inquiry
    await resend.emails.send({
      from: `Coach Luki Site <${fromEmail}>`,
      replyTo: email,
      to: replyToEmail,
      subject: `New inquiry from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nGoal: ${goal || "Not specified"}\nMessage: ${message || "No message"}\n\nReply to this email to respond directly to ${firstName}.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
