import crypto from "node:crypto";

/**
 * HMAC-signed unsubscribe tokens.
 *
 * We don't store tokens in the DB — instead we sign `email` with a server
 * secret and verify the signature on click. This means the link is stable
 * per-email (no DB write needed on send) and cannot be forged without
 * knowing the secret.
 *
 * Uses CRON_SECRET as a fallback since it already exists in env. For
 * stronger isolation, set UNSUBSCRIBE_SECRET explicitly.
 */

const SITE_URL = "https://coachluki.com";

function getSecret(): string {
  const secret =
    process.env.UNSUBSCRIBE_SECRET ||
    process.env.CRON_SECRET ||
    // Dev-only fallback — will throw on prod-like envs so we never accidentally
    // ship with an unguessable-but-hardcoded secret.
    (process.env.NODE_ENV === "production" ? "" : "dev-secret-not-for-prod");

  if (!secret) {
    throw new Error(
      "Neither UNSUBSCRIBE_SECRET nor CRON_SECRET is configured — unsubscribe tokens cannot be signed"
    );
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
