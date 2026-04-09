import crypto from "node:crypto";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coachluki.com";

function getSecret() {
  return (
    process.env.UNSUBSCRIBE_SECRET ||
    process.env.CRON_SECRET ||
    process.env.RESEND_API_KEY ||
    "coachluki-dev-unsubscribe"
  );
}

export function signEmail(email: string): string {
  return crypto
    .createHmac("sha256", getSecret())
    .update(email.toLowerCase())
    .digest("hex")
    .slice(0, 32);
}

export function verifyEmailToken(email: string, token: string): boolean {
  const expected = signEmail(email);
  if (expected.length !== token.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(token));
}

export function unsubscribeUrl(email: string): string {
  const token = signEmail(email);
  const params = new URLSearchParams({ email, token });
  return `${SITE_URL}/api/unsubscribe?${params.toString()}`;
}
