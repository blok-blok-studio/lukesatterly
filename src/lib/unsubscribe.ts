import crypto from "node:crypto";

/**
 * HMAC-signed unsubscribe tokens.
 *
 * We sign `email` with UNSUBSCRIBE_SECRET and verify the signature on click.
 * The link is stable per-email (no DB write needed on send) and cannot be
 * forged without knowing the secret.
 */

const SITE_URL = "https://coachluki.com";

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("UNSUBSCRIBE_SECRET is not configured");
    }
    return "dev-secret-not-for-prod";
  }
  return secret;
}

export function signUnsubscribeToken(email: string): string {
  const secret = getSecret();
  return crypto
    .createHmac("sha256", secret)
    .update(email.toLowerCase())
    .digest("base64url");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = signUnsubscribeToken(email);
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Build a fully-qualified unsubscribe URL for a subscriber. */
export function buildUnsubscribeUrl(email: string): string {
  const token = signUnsubscribeToken(email);
  const params = new URLSearchParams({ e: email, t: token });
  return `${SITE_URL}/api/unsubscribe?${params.toString()}`;
}
