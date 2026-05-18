// Generates public/coach-luki-og-personal-trainer-berlin.jpg
// 1200x630 social card: Luke (rings photo) on the left, dark panel with
// logo wordmark + slogan on the right. Run with: node scripts/build-og-image.mjs
import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";
import { Buffer } from "node:buffer";

const W = 1200;
const H = 630;
const PHOTO_W = 680;
const PANEL_X = PHOTO_W;
const PANEL_W = W - PHOTO_W;

const SLOGAN = "Train smarter.\nLive stronger.\nBerlin.";
const URL_TEXT = "coachluki.com";

// Extract a region from the 1067x1600 source that frames his face + the rings.
// Output aspect is 680/630 ≈ 1.08, so width 1067 needs height 1067/1.08 ≈ 988.
// Pull from y=180 to keep rings visible up top and face roughly centered.
const photoBuf = await sharp("public/coach-luki-personal-trainer-berlin-rings.webp")
  .extract({ left: 0, top: 180, width: 1067, height: 988 })
  .resize({ width: PHOTO_W, height: H, fit: "cover" })
  .toBuffer();

const logoBuf = await sharp("public/logo-wordmark-white.png")
  .resize({ width: 320 })
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

const sloganLines = SLOGAN.split("\n");
const sloganStartY = 340;
const sloganLineH = 60;

const svg = `
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
        font-size: 52px;
        fill: #ffffff;
        letter-spacing: -1.5px;
      }
      .url {
        font-family: 'Outfit', sans-serif;
        font-weight: 500;
        font-size: 22px;
        fill: #8ee63d;
        letter-spacing: 0.5px;
      }
      .tag {
        font-family: 'Outfit', sans-serif;
        font-weight: 400;
        font-size: 18px;
        fill: #a3a3a3;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }
    </style>
    <linearGradient id="photoFade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0.78" stop-color="#0C0C0C" stop-opacity="0"/>
      <stop offset="1" stop-color="#0C0C0C" stop-opacity="1"/>
    </linearGradient>
  </defs>

  <!-- dark panel background (right side only — left side stays transparent so the photo shows) -->
  <rect x="${PANEL_X}" y="0" width="${PANEL_W}" height="${H}" fill="#0C0C0C"/>

  <!-- gradient fade on right edge of photo into panel -->
  <rect x="0" y="0" width="${PHOTO_W}" height="${H}" fill="url(#photoFade)"/>

  <!-- subtle green accent line -->
  <rect x="${PANEL_X + 60}" y="240" width="48" height="3" fill="#8ee63d"/>

  <!-- tagline above slogan -->
  <text x="${PANEL_X + 60}" y="280" class="tag">Personal Trainer · Berlin</text>

  <!-- slogan, multi-line -->
  ${sloganLines
    .map(
      (line, i) =>
        `<text x="${PANEL_X + 60}" y="${sloganStartY + i * sloganLineH}" class="slogan">${line}</text>`,
    )
    .join("\n  ")}

  <!-- url at bottom -->
  <text x="${PANEL_X + 60}" y="${H - 60}" class="url">${URL_TEXT}</text>
</svg>
`;

await sharp({
  create: { width: W, height: H, channels: 3, background: "#0C0C0C" },
})
  .composite([
    { input: photoBuf, left: 0, top: 0 },
    { input: Buffer.from(svg), left: 0, top: 0 },
    {
      input: logoBuf,
      left: PANEL_X + 60,
      top: 90,
    },
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
