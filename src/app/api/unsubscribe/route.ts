import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe";

/**
 * Unsubscribe endpoint.
 *
 * - GET:  user clicks the footer link in an email → show a confirmation page
 * - POST: Gmail / Apple Mail One-Click Unsubscribe (RFC 8058)
 *
 * Both paths verify an HMAC-signed token, flip `unsubscribed=true`, and
 * (optionally) remove the contact from the Resend audience so the drip
 * sequence stops.
 */

async function unsubscribeEmail(email: string): Promise<{ ok: boolean; message: string }> {
  try {
    const subscriber = await prisma.subscriber.findUnique({ where: { email } });
    if (!subscriber) {
      // Return 200 anyway — don't leak which addresses are in the list
      return { ok: true, message: "Unsubscribed." };
    }

    await prisma.subscriber.update({
      where: { email },
      data: { unsubscribed: true },
    });

    // Best-effort removal from Resend audience
    const apiKey = process.env.RESEND_API_KEY;
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    if (apiKey && audienceId) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(apiKey);
        await resend.contacts.update({
          audienceId,
          email,
          unsubscribed: true,
        });
      } catch (e) {
        // Don't block the unsubscribe on Resend API hiccup
        console.error("Resend audience update failed:", e);
      }
    }

    return { ok: true, message: "Unsubscribed." };
  } catch (e) {
    console.error("Unsubscribe error:", e);
    return { ok: false, message: "Something went wrong." };
  }
}

function validate(request: Request): { email: string } | { error: string; status: number } {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("e") || "").toLowerCase().trim();
  const token = searchParams.get("t") || "";

  if (!email || !token) {
    return { error: "Missing parameters", status: 400 };
  }
  if (!verifyUnsubscribeToken(email, token)) {
    return { error: "Invalid token", status: 403 };
  }
  return { email };
}

// Simple styled HTML confirmation page — doesn't depend on the React app,
// so the CSP is irrelevant here.
function renderPage(title: string, body: string) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>${title} — Coach Luki</title>
    <style>
      body { margin: 0; min-height: 100vh; background: #0C0C0C; color: #F0EDE6;
             font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
             display: flex; align-items: center; justify-content: center; padding: 20px; }
      .card { max-width: 440px; text-align: center; padding: 40px 28px;
              background: #161616; border: 1px solid rgba(255,255,255,0.06);
              border-radius: 16px; }
      h1 { font-size: 22px; margin: 0 0 12px; color: #fff; }
      p { line-height: 1.6; color: #a1a1aa; margin: 0 0 16px; }
      a { color: #00803D; text-decoration: none; font-weight: 600; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${title}</h1>
      ${body}
      <p><a href="https://coachluki.com">Back to coachluki.com</a></p>
    </div>
  </body>
</html>`;
}

export async function GET(request: Request) {
  const result = validate(request);
  if ("error" in result) {
    return new NextResponse(
      renderPage("Invalid link", `<p>${result.error}. If you need help, reply to any email.</p>`),
      { status: result.status, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const { ok, message } = await unsubscribeEmail(result.email);
  return new NextResponse(
    renderPage(
      ok ? "You're unsubscribed" : "Something went wrong",
      ok
        ? `<p>You won't receive any more emails from Coach Luki. Changed your mind? Just reply to any previous email and we'll add you back.</p>`
        : `<p>${message} Please reply to any email and we'll take care of it manually.</p>`
    ),
    { status: ok ? 200 : 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

/**
 * One-Click unsubscribe per RFC 8058. Gmail / Yahoo / Apple Mail send a POST
 * to the URL in List-Unsubscribe when the user clicks their native
 * unsubscribe button. Must return 2xx on success.
 */
export async function POST(request: Request) {
  const result = validate(request);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  const { ok, message } = await unsubscribeEmail(result.email);
  if (!ok) {
    return NextResponse.json({ error: message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
