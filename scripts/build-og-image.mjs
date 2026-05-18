// Generates public/coach-luki-og-personal-trainer-berlin.jpg
// 1200x630 full-bleed social card: Luke (rings photo) fills the whole frame,
// logo + slogan overlaid directly so they survive WhatsApp/iMessage
// square-crop thumbnails. Run with: node scripts/build-og-image.mjs
import sharp from "sharp";
import { Buffer } from "node:buffer";

const W = 1200;
const H = 630;

const SLOGAN_LINES = ["Train smarter.", "Live stronger."];
const TAG = "Personal Trainer · Berlin";
const URL_TEXT = "coachluki.com";

// Source is 1067x1600. Pull a region that keeps Luke's face and the rings
// in frame, then fit-cover into 1200x630.
const photoBuf = await sharp("public/coach-luki-personal-trainer-berlin-rings.webp")
  .extract({ left: 0, top: 200, width: 1067, height: 950 })
  .resize({ width: W, height: H, fit: "cover", position: "center" })
  .toBuffer();

const logoBuf = await sharp("public/logo-wordmark-white.png")
  .resize({ width: 260 })
  .toBuffer();
const logoMeta = await sharp(logoBuf).metadata();

const syneTtf = await fetchFont(
  "https://github.com/google/fonts/raw/main/ofl/syne/Syne%5Bwght%5D.ttf",
);
const outfitTtf = await fetchFont(
  "https://github.com/google/fonts/raw/main/ofl/outfit/Outfit%5Bwght%5D.ttf",
);
const syne64 = syneTtf.toString("base64");
const outfit64 = outfitTtf.toString("base64");

// Two gradient overlays for legibility:
// - subtle top gradient behind the logo
// - stronger bottom gradient behind the slogan + url
const overlaySvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'Syne';
        src: url(data:font/ttf;base64,${syne64}) format('truetype');
        font-weight: 100 900;
      }
      @font-face {
        font-family: 'Outfit';
        src: url(data:font/ttf;base64,${outfit64}) format('truetype');
        font-weight: 100 900;
      }
      .slogan {
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        font-size: 64px;
        fill: #ffffff;
        letter-spacing: -1.5px;
      }
      .url {
        font-family: 'Outfit', sans-serif;
        font-weight: 500;
        font-size: 24px;
        fill: #8ee63d;
        letter-spacing: 0.5px;
      }
      .tag {
        font-family: 'Outfit', sans-serif;
        font-weight: 500;
        font-size: 18px;
        fill: #e5e5e5;
        letter-spacing: 2px;
        text-transform: uppercase;
      }
    </style>
    <linearGradient id="topShade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.65"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="bottomShade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#000000" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.92"/>
    </linearGradient>
  </defs>

  <!-- top shade behind logo -->
  <rect x="0" y="0" width="${W}" height="200" fill="url(#topShade)"/>

  <!-- bottom shade behind slogan -->
  <rect x="0" y="280" width="${W}" height="${H - 280}" fill="url(#bottomShade)"/>

  <!-- slogan two-line -->
  <text x="60" y="450" class="slogan">${SLOGAN_LINES[0]}</text>
  <text x="60" y="520" class="slogan">${SLOGAN_LINES[1]}</text>

  <!-- green accent + tagline -->
  <rect x="60" y="555" width="36" height="3" fill="#8ee63d"/>
  <text x="60" y="588" class="tag">${TAG}</text>

  <!-- url bottom right -->
  <text x="${W - 60}" y="588" class="url" text-anchor="end">${URL_TEXT}</text>
</svg>
`;

await sharp({
  create: { width: W, height: H, channels: 3, background: "#0C0C0C" },
})
  .composite([
    { input: photoBuf, left: 0, top: 0 },
    { input: Buffer.from(overlaySvg), left: 0, top: 0 },
    // logo top-left over the dark top-shade
    { input: logoBuf, left: 60, top: 60 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/coach-luki-og-personal-trainer-berlin.jpg");

console.log("Wrote public/coach-luki-og-personal-trainer-berlin.jpg (1200x630)");
console.log("Logo rendered at", logoMeta.width, "x", logoMeta.height);

async function fetchFont(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
