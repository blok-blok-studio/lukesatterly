// Generates public/coach-luki-og-personal-trainer-berlin.jpg
// 1200x630 split card: Luke (rings photo) on the left with a corner logo,
// green-gradient panel on the right with a big wordmark + slogan inside it.
// Run with: node scripts/build-og-image.mjs
import sharp from "sharp";
import { Buffer } from "node:buffer";

const W = 1200;
const H = 630;
const PHOTO_W = 680;
const PANEL_X = PHOTO_W;
const PANEL_W = W - PHOTO_W;

const SLOGAN = "Train smarter.\nLive stronger.\nBerlin.";
const URL_TEXT = "coachluki.com";

const photoBuf = await sharp("public/coach-luki-personal-trainer-berlin-rings.webp")
  .extract({ left: 0, top: 180, width: 1067, height: 988 })
  .resize({ width: PHOTO_W, height: H, fit: "cover" })
  .toBuffer();

// White wordmark on the deep-forest green panel — high contrast, on-brand.
const panelLogoBuf = await sharp("public/logo-wordmark-white.png")
  .resize({ width: 380 })
  .toBuffer();
const panelLogoMeta = await sharp(panelLogoBuf).metadata();

// Icon mark (favicon) baked onto the photo corner — crop-safe.
const photoLogoBuf = await sharp("public/logo-icon-green.png")
  .resize({ width: 110, height: 110, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .toBuffer();

const syneTtf = await fetchFont(
  "https://github.com/google/fonts/raw/main/ofl/syne/Syne%5Bwght%5D.ttf",
);
const outfitTtf = await fetchFont(
  "https://github.com/google/fonts/raw/main/ofl/outfit/Outfit%5Bwght%5D.ttf",
);
const syne64 = syneTtf.toString("base64");
const outfit64 = outfitTtf.toString("base64");

const sloganLines = SLOGAN.split("\n");
const sloganStartY = 360;
const sloganLineH = 56;

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
        font-size: 48px;
        fill: #F0EDE6;
        letter-spacing: -1.2px;
      }
      .url {
        font-family: 'Outfit', sans-serif;
        font-weight: 600;
        font-size: 22px;
        fill: #F0EDE6;
        letter-spacing: 0.5px;
      }
      .tag {
        font-family: 'Outfit', sans-serif;
        font-weight: 500;
        font-size: 16px;
        fill: #F0EDE6;
        opacity: 0.7;
        letter-spacing: 1.5px;
        text-transform: uppercase;
      }
    </style>
    <!-- Matches site's .gradient-text: 135deg, #00803D → #006633 → #005528 -->
    <linearGradient id="greenPanel" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0" stop-color="#00803D"/>
      <stop offset="0.5" stop-color="#006633"/>
      <stop offset="1" stop-color="#005528"/>
    </linearGradient>
    <linearGradient id="photoFade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0.78" stop-color="#00803D" stop-opacity="0"/>
      <stop offset="1" stop-color="#00803D" stop-opacity="0.85"/>
    </linearGradient>
    <linearGradient id="logoShade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0" stop-color="#000000" stop-opacity="0.55"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0"/>
    </linearGradient>
  </defs>

  <!-- green gradient panel on the right -->
  <rect x="${PANEL_X}" y="0" width="${PANEL_W}" height="${H}" fill="url(#greenPanel)"/>

  <!-- soft green bleed from the photo edge into the panel -->
  <rect x="0" y="0" width="${PHOTO_W}" height="${H}" fill="url(#photoFade)"/>

  <!-- top shade behind the photo-side logo -->
  <rect x="0" y="0" width="${PHOTO_W}" height="160" fill="url(#logoShade)"/>

  <!-- subtle accent line under the wordmark -->
  <rect x="${PANEL_X + 60}" y="270" width="48" height="3" fill="#F0EDE6" opacity="0.6"/>

  <!-- tagline -->
  <text x="${PANEL_X + 60}" y="305" class="tag">Personal Trainer · Berlin</text>

  <!-- slogan, three-line -->
  ${sloganLines
    .map(
      (line, i) =>
        `<text x="${PANEL_X + 60}" y="${sloganStartY + i * sloganLineH}" class="slogan">${line}</text>`,
    )
    .join("\n  ")}

  <!-- url at bottom -->
  <text x="${PANEL_X + 60}" y="${H - 50}" class="url">${URL_TEXT}</text>
</svg>
`;

await sharp({
  create: { width: W, height: H, channels: 3, background: "#0C0C0C" },
})
  .composite([
    { input: photoBuf, left: 0, top: 0 },
    { input: Buffer.from(svg), left: 0, top: 0 },
    // small white logo on photo corner — crop-safe
    { input: photoLogoBuf, left: 36, top: 36 },
    // big black wordmark sitting inside the green gradient
    {
      input: panelLogoBuf,
      left: PANEL_X + 60,
      top: 110,
    },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile("public/coach-luki-og-personal-trainer-berlin.jpg");

console.log("Wrote public/coach-luki-og-personal-trainer-berlin.jpg (1200x630)");
console.log("Panel logo:", panelLogoMeta.width, "x", panelLogoMeta.height);

async function fetchFont(url) {
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}
