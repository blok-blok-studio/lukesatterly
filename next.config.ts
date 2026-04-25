import type { NextConfig } from "next";

// Security headers applied to every response
const securityHeaders = [
  // Force HTTPS for 2 years, include subdomains, enable preload
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  // X-Frame-Options removed in favor of CSP frame-ancestors below, which
  // allows specifying multiple permitted origins. The legacy header only
  // supports DENY/SAMEORIGIN and would override frame-ancestors in some
  // browsers, blocking the BlokBlok Studio portfolio embed.
  // Prevent MIME sniffing
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  // Limit referrer information leaked to third parties
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  // Restrict dangerous browser features
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self)",
  },
  // Cross-origin isolation hardening
  {
    key: "Cross-Origin-Opener-Policy",
    value: "same-origin",
  },
  {
    key: "Cross-Origin-Resource-Policy",
    value: "same-origin",
  },
  // Content Security Policy — allows Google Fonts, Google Calendar (funnel embed),
  // Stripe buy.stripe.com payment links, Vercel analytics, Next.js inline scripts.
  // 'unsafe-inline' on style is required by Tailwind/Next; 'unsafe-inline' on script
  // is needed for Next.js hydration payloads.
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https:",
      "media-src 'self' https:",
      "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
      "frame-src 'self' https://calendar.google.com https://buy.stripe.com https://js.stripe.com",
      "frame-ancestors 'self' https://blokblokstudio.com https://www.blokblokstudio.com https://*.vercel.app",
      "form-action 'self' https://buy.stripe.com",
      "base-uri 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Hide the `X-Powered-By: Next.js` header (information disclosure)
  poweredByHeader: false,

  // Apply security headers to every route
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  // Image optimization — only allow our own assets + known-good CDNs
  images: {
    remotePatterns: [],
    // Modern formats for smaller payloads and faster LCP (SEO)
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
