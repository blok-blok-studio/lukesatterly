import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyEmailToken } from "@/lib/unsubscribe";

async function unsubscribe(email: string, token: string) {
  if (!email || !token || !verifyEmailToken(email, token)) {
    return { ok: false, status: 400 as const };
  }
  await prisma.subscriber.updateMany({
    where: { email: email.toLowerCase() },
    data: { unsubscribed: true },
  });
  return { ok: true, status: 200 as const };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") || "").toLowerCase();
  const token = searchParams.get("token") || "";
  const result = await unsubscribe(email, token);

  if (!result.ok) {
    return new NextResponse(
      `<!doctype html><html><body style="font-family:-apple-system,sans-serif;padding:40px;text-align:center;color:#333">
        <h1>Invalid unsubscribe link</h1>
        <p>This link is not valid. If you keep getting emails, reply to the most recent one and we'll remove you manually.</p>
      </body></html>`,
      { status: 400, headers: { "Content-Type": "text/html" } }
    );
  }

  return new NextResponse(
    `<!doctype html><html><body style="font-family:-apple-system,sans-serif;padding:40px;text-align:center;color:#333;max-width:560px;margin:0 auto">
      <h1>You're unsubscribed</h1>
      <p>You won't receive any more emails from Coach Luki. Sorry to see you go — if there's something we could have done better, just hit reply and let us know.</p>
      <p style="color:#999;font-size:12px;margin-top:32px">${email}</p>
    </body></html>`,
    { status: 200, headers: { "Content-Type": "text/html" } }
  );
}

// Gmail / Apple Mail one-click unsubscribe (RFC 8058)
export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  let email = (searchParams.get("email") || "").toLowerCase();
  let token = searchParams.get("token") || "";

  if (!email || !token) {
    try {
      const form = await request.formData();
      email = email || String(form.get("email") || "").toLowerCase();
      token = token || String(form.get("token") || "");
    } catch {
      // ignore
    }
  }

  const result = await unsubscribe(email, token);
  return NextResponse.json({ success: result.ok }, { status: result.status });
}
