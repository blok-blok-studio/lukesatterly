#!/usr/bin/env node
/**
 * Pings IndexNow with the site's URLs after each production build so Bing,
 * Yandex, Seznam, and Naver pick up changes immediately. Google does not
 * participate in IndexNow — submit the sitemap via Search Console for it.
 *
 * Skips on non-production builds and on local dev so we don't spam the API.
 */

const KEY = "48adfee80447bafafa2835f844c93a22";
const HOST = "coachluki.com";
const URL_LIST = [
  `https://${HOST}/`,
  `https://${HOST}/start`,
];

// Only run on Vercel production deploys. Bail quietly otherwise.
const isVercelProd =
  process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

if (!isVercelProd) {
  console.log("[indexnow] Skipped — not a Vercel production build.");
  process.exit(0);
}

const body = {
  host: HOST,
  key: KEY,
  keyLocation: `https://${HOST}/${KEY}.txt`,
  urlList: URL_LIST,
};

try {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  // 200 = received, 202 = accepted, both are success per IndexNow spec.
  if (res.ok || res.status === 202) {
    console.log(`[indexnow] OK (${res.status}) — submitted ${URL_LIST.length} URLs`);
  } else {
    const text = await res.text().catch(() => "");
    console.warn(`[indexnow] Non-fatal: HTTP ${res.status} ${text}`);
  }
} catch (err) {
  // Don't fail the deploy if IndexNow is down.
  console.warn(`[indexnow] Non-fatal error: ${err?.message ?? err}`);
}
