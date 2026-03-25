---
name: blokblok-site-builder
description: >
  Build complete, production-ready Next.js client websites for BlokBlok Studio.
  Use this skill whenever the task involves creating a new client website,
  building out pages from a client brief, scaffolding a site from the BlokBlok
  boilerplate, deploying to Vercel, or customizing the boilerplate for a
  specific client project. Also trigger when asked to build landing pages,
  marketing sites, portfolio sites, or any web project that should follow
  BlokBlok's agency standards. Trigger for any mention of "client site",
  "client build", "new website project", "BlokBlok boilerplate", "site builder",
  or requests involving Aceternity UI, Magic UI component assembly, or
  Remotion video generation tied to a client brand. This skill covers the full
  lifecycle: design system generation, reading client briefs, pulling assets,
  assembling pages from section components, configuring CMS schemas, setting
  up SEO, generating branded video content, and deploying preview builds.
  Also trigger when asked about UI/UX design decisions, style selection,
  color palette generation, or typography pairing for any BlokBlok project.
---

# BlokBlok Site Builder

You are building a client website for BlokBlok Studio, a digital agency based in Berlin.
Every site you build must meet agency-level quality standards. You are not
generating a generic template — you are crafting a unique, premium website
tailored to the client's brand and goals.

---

## Dependencies

This skill relies on the following tools and skills. Ensure they are available
before starting a build.

### Required

| Tool | Purpose | Install |
|------|---------|---------|
| **UI UX Pro Max** | Design intelligence engine: generates complete design systems from client briefs (styles, colors, typography, effects, anti-patterns) | `npm install -g uipro-cli && uipro init --ai claude` |
| **shadcn/ui** | Base component layer (Layer 1) | `npx shadcn@latest init` |
| **Framer Motion** | Animation engine (only animation lib allowed) | `pnpm add framer-motion` |
| **Tailwind CSS v4** | Styling foundation | Included in boilerplate |

### Component Sources (Free, Copy-Paste-Own)

| Source | Layer | Use For |
|--------|-------|---------|
| **shadcn/ui** | 1 (Base) | Buttons, inputs, forms, dialogs, popovers, all primitives |
| **Aceternity UI** | 2 (Sections) | Hero sections, testimonials, pricing, feature grids, 3D cards |
| **Magic UI** | 3 (Accents) | Animated counters, text effects, sparkles, marquees, particles |
| **Radix UI Primitives** | 1.5 (Accessible) | When shadcn doesn't cover a pattern (e.g. complex selects, toasts) |
| **Preline / HyperUI** | 4 (Structural) | Quick structural blocks when you need a starting layout fast |
| **awesome-shadcn-ui ecosystem** | Browse | Community components: calendars, kanban boards, sidebar patterns, data tables |

### Optional Paid (Not Required)

| Tool | What It Does | Cost | When to Use |
|------|-------------|------|-------------|
| **21st.dev** | Curated shadcn component marketplace with AI generation | $20/mo Pro (5 free tokens/mo) | Browse for inspiration. Premium components are nice but never necessary. Everything can be built from the free layers above. |

---

## Phase 0: Design System Generation

**This phase is mandatory before writing any code.**

Before selecting components, themes, or colors, run the client brief through
the UI UX Pro Max reasoning engine to generate a complete design system.

### Step 1: Analyze the Client Brief

Read the brief thoroughly. Extract:
- Business type and industry (maps to one of UUPM's 161 product categories)
- Target audience demographics and psychographics
- Tone keywords (e.g. "luxury", "playful", "technical", "warm")
- Competitive landscape (who are they trying to look better than?)
- Key pages needed and their conversion goals
- Content provided vs content needed
- Specific functionality requirements

### Step 2: Generate the Design System

Run the UUPM design system generator:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<industry keywords>" \
  --design-system \
  -p "<Client Name>" \
  -f markdown
```

Example:
```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "fitness coaching personal training" \
  --design-system \
  -p "Coach Kofi" \
  -f markdown
```

This produces:
- **Recommended landing page pattern** (Hero-Centric, Conversion-Optimized, Social Proof, etc.)
- **UI style** from 67 options (not a guess — matched via BM25 ranking against the industry)
- **Color palette** (primary, secondary, CTA, background, text, with rationale)
- **Typography pairing** (display + body, with Google Fonts import URL)
- **Key effects** (animation style, transitions, hover states)
- **Anti-patterns** (what NOT to do for this industry)
- **Pre-delivery checklist**

### Step 3: Persist the Design System

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<keywords>" \
  --design-system --persist \
  -p "<Client Name>"
```

This creates:
```
design-system/
  MASTER.md           # Global source of truth
  pages/
    homepage.md       # Page-specific overrides (if needed)
    about.md
```

### Step 4: Bridge to Theme Config

Take the UUPM output and translate it into `config/theme.config.ts`:

```typescript
// Generated from UUPM design system for [Client Name]
export const theme = {
  aesthetic: "soft-ui-evolution", // from UUPM style recommendation
  colors: {
    primary: "#E8B4B8",    // from UUPM palette
    secondary: "#A8D5BA",
    cta: "#D4AF37",
    background: "#FFF5F5",
    text: "#2D3436",
    // Always define dark mode counterparts
    dark: {
      primary: "#C4929A",
      secondary: "#7DB894",
      cta: "#E8C84A",
      background: "#1A1A2E",
      text: "#E8E8E8",
    }
  },
  fonts: {
    display: "Cormorant Garamond", // from UUPM typography
    body: "Montserrat",
    mono: "JetBrains Mono",       // BlokBlok standard for code
  },
  effects: {
    shadows: "soft",               // from UUPM key effects
    transitions: "200-300ms",
    hoverStates: "gentle",
  },
  antiPatterns: [
    "bright neon colors",
    "harsh animations",
    "AI purple/pink gradients",
  ],
}
```

**Do not skip this phase.** If UUPM is not installed, manually define all of
the above based on the client brief using the same structure. But always
prefer the reasoning engine output — it's more consistent and eliminates
the AI-slop convergence problem.

---

## Phase 1: Design Direction (Anti-Slop Gate)

Even with a generated design system, every build must pass through a
creative direction check. This prevents the "all AI sites look the same"
problem.

### The Unforgettable Test

Before building, answer: **What is the one thing someone will remember
about this site after closing the tab?**

If the answer is "nothing" or "it looks clean", the design direction is
too generic. Push harder.

### Design Philosophy

**Typography**: Every project gets a unique font pairing. Never reuse the
same display font across clients. Never use Inter, Roboto, Arial, or
system fonts. Never default to Space Grotesk just because it looks modern.
Pair a distinctive display font with a refined body font. UUPM provides
57 curated pairings — use them.

**Color**: Commit to a dominant color with sharp accents. Timid,
evenly-distributed palettes are banned. The CTA color must create
contrast tension. Use CSS variables for all colors — no hardcoded hex
values in components.

**Motion**: One well-orchestrated page load with staggered reveals
creates more delight than scattered micro-interactions everywhere.
Focus on high-impact moments: hero entrance, scroll-triggered section
reveals, hover states that surprise. Framer Motion is the only
animation library allowed.

**Spatial Composition**: Break the grid intentionally. Asymmetric layouts,
overlapping elements, diagonal flow, generous negative space or
controlled density — pick a spatial strategy and commit. Not every
section should be center-aligned with max-width prose.

**Backgrounds & Atmosphere**: Never default to solid white or solid
dark backgrounds. Create depth with gradient meshes, noise textures,
geometric patterns, layered transparencies, dramatic shadows, grain
overlays, or WebGL shaders (for hero sections on premium builds).

**The Anti-Slop Blacklist**:
- Generic purple-on-white gradient schemes
- Inter/Roboto/Arial/system font stacks
- Cookie-cutter card grids with identical border-radius
- Predictable hero → features → testimonials → CTA with no visual variation
- Overuse of blur/glass effects without purpose
- Components used unchanged from any library
- Emojis as icons (use SVG: Lucide, Heroicons, or custom)

**Match complexity to vision**: Maximalist designs need elaborate code
with extensive animations and effects. Minimalist designs need restraint,
precision, and obsessive attention to spacing, typography, and subtle
details. Elegance comes from executing the vision with precision,
not from picking "minimal" and phoning it in.

---

## Phase 2: Project Setup

### Initialize

Clone the blokblok-starter boilerplate:

```bash
git clone <boilerplate-repo-url> client-project-name
cd client-project-name
pnpm install
```

### Install UUPM (if not already present)

```bash
uipro init --ai claude
```

### Check the Vault for Client Assets

Before writing any code:
- Logo files (SVG preferred, PNG fallback)
- Brand colors (if provided — override UUPM palette if client has existing brand)
- Photography/imagery
- Copy/content documents
- Brand guidelines (if they exist)

If assets or critical information are missing, list what's needed and create
a Kanban card in the command center tagged with the client name. Do not
proceed with placeholder content for critical brand elements (logo, primary
colors).

### Configure Site Identity

Update `config/site.ts`:

```typescript
export const siteConfig = {
  name: "Client Business Name",
  description: "One-line description for meta tags",
  tagline: "Marketing tagline",
  url: "https://clientdomain.com",
  social: {
    instagram: "...",
    linkedin: "...",
    // etc
  },
  contact: {
    email: "...",
    phone: "...",
    address: "...",
  },
}
```

---

## Phase 3: Building Pages

### Page Assembly Pattern

Pages are composed by stacking section components. Each section accepts a
`variant` prop, content as props, and handles its own responsive behavior
and animations.

```tsx
export default function HomePage() {
  return (
    <>
      <HeroSection
        variant="split"
        headline="..."
        subheadline="..."
        ctaText="Get Started"
        ctaLink="/contact"
      />
      <FeaturesGrid variant="bento" features={[...]} />
      <TestimonialsSection variant="carousel" testimonials={[...]} />
      <CTASection variant="banner" headline="..." ctaText="..." />
      <FAQSection variant="accordion" items={[...]} />
    </>
  );
}
```

### Variant Selection

Choose section variants based on the UUPM-generated design system style.
The design system output includes a recommended landing page pattern
(section order + variant hints). Use that as the starting point, then
customize.

**Fallback matrix** if UUPM output doesn't specify variants:

| Style Category | Hero | Features | Testimonials | CTA |
|----------------|------|----------|-------------|-----|
| Minimal / Swiss | `centered` or `minimal` | `icon-grid` | `single-spotlight` | `inline` |
| Bold / Vibrant | `fullscreen` | `bento` | `marquee` | `banner` |
| Editorial / Magazine | `split` | `alternating-rows` | `carousel` | `card` |
| Luxury / Premium | `fullscreen` or `split` | `tabs` | `single-spotlight` | `floating` |
| Dark Mode / Tech | `fullscreen` with particles | `bento` | `carousel` | `banner` |
| Organic / Wellness | `split` with soft imagery | `icon-grid` | `single-spotlight` | `inline` |

Override based on content and client needs. These are starting points.

### Component Selection Decision Tree

```
Need a basic UI element (button, input, form, dialog)?
  → shadcn/ui (Layer 1)

Need accessible primitives not in shadcn (complex select, toast, tabs)?
  → Radix UI (Layer 1.5)

Need a page section with visual impact (hero, testimonials, pricing)?
  → Aceternity UI first (Layer 2)
  → If no matching variant, build custom using Layer 1 + Framer Motion

Need animated accent or micro-interaction (counters, text, particles)?
  → Magic UI (Layer 3)

Need a quick structural layout block?
  → Preline/HyperUI (Layer 4)

Need a complex pattern (calendar, kanban, sidebar)?
  → Check awesome-shadcn-ui ecosystem first
  → Build custom if nothing fits

Need something completely custom?
  → Build from scratch using Tailwind + Framer Motion
  → Follow the section component pattern from the boilerplate
```

### Advanced Visual Effects (Premium Builds)

For high-end client sites where the budget justifies it:

| Effect | Implementation | When to Use |
|--------|---------------|-------------|
| WebGL shader backgrounds | Three.js or custom GLSL via `@react-three/fiber` | Hero sections on luxury/tech/creative sites |
| Particle systems | tsParticles or custom Canvas | Tech, SaaS, creative agency heroes |
| Scroll-driven animations | Framer Motion `useScroll` + `useTransform` | Storytelling sections, parallax |
| 3D product viewers | `@react-three/drei` | E-commerce, product showcase |
| Kinetic typography | Framer Motion `layoutId` + stagger | Hero headlines, section transitions |
| Cursor-following effects | Custom hook + Framer Motion | Creative portfolios, interactive sites |
| Noise/grain overlays | CSS `filter` or SVG `feTurbulence` | Film, photography, vintage aesthetics |

Only add these when the design direction calls for it. Premium effects on
a minimal design make it feel incoherent. Match complexity to vision.

### Content Rules

- Never use Lorem Ipsum. Write realistic placeholder copy matching the client's industry and tone. Flag with `{/* TODO: Replace with client copy */}`.
- All images must have descriptive alt text.
- Headlines: concise and impactful (under 10 words for heroes).
- Body copy: scannable — short paragraphs, clear hierarchy.
- All clickable elements must have `cursor-pointer`.
- All hover states must have smooth transitions (150-300ms).
- All focus states must be visible for keyboard navigation.
- Respect `prefers-reduced-motion` on every animation.

---

## Phase 4: CMS Integration

Default CMS is Sanity. Set up schemas for:

- **Pages**: Title, slug, sections array (portable text for flexible content)
- **Posts**: Title, slug, author, date, body (portable text), featured image, categories
- **Settings**: Site name, logo, navigation items, footer content, social links
- **Testimonials**: Name, role, company, quote, avatar
- **FAQ Items**: Question, answer, category
- **Team Members**: Name, role, bio, photo, social links (if applicable)

Adapt `lib/cms.ts` if client needs Contentful, Strapi, or another CMS.

---

## Phase 5: Video Content (Remotion)

When the project includes video deliverables:

- Composition templates: PromoVideo, SocialClip, TestimonialVideo, ProductShowcase, CaseStudy, StoryAd
- Theme bridge: auto-imports site theme tokens (colors, fonts) into Remotion compositions
- 11 Labs TTS integration for voiceover
- Output formats: MP4, WebM, GIF, still frames

---

## Phase 6: SEO & Performance

### SEO Checklist

Every page must have:
- Unique title tag (under 60 chars)
- Meta description (under 155 chars)
- Open Graph image (1200x630)
- Canonical URL
- Proper heading hierarchy (single H1, logical H2-H6)
- Structured data (JSON-LD) for business type
- sitemap.xml (auto-generated by Next.js)
- robots.txt configured

### Performance Standards

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- LCP: under 2.5s
- CLS: under 0.1
- All images use `next/image` with proper sizing
- Fonts preloaded, subset where possible
- No render-blocking resources
- Code-split routes with dynamic imports for heavy components

---

## Phase 7: Deployment

1. Push to GitHub repository
2. Connect to Vercel (or use Vercel CLI)
3. Set environment variables (CMS keys, analytics IDs, form endpoints, secrets)
4. Deploy preview build
5. Create "In Review" card on command center Kanban
6. Share preview URL with Chase for review

**Do not deploy to production without explicit approval from Chase.**

---

## Quality Checklist Before Review

- [ ] Design system generated and persisted (MASTER.md exists)
- [ ] Theme config matches UUPM output (colors, fonts, effects)
- [ ] No generic/banned fonts used anywhere
- [ ] No emojis used as icons (SVG only: Lucide, Heroicons, or custom)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms) on all interactive elements
- [ ] Light mode text contrast ratio 4.5:1 minimum (WCAG AA)
- [ ] Focus states visible for keyboard navigation
- [ ] prefers-reduced-motion respected on all animations
- [ ] Responsive tested at: 375px, 768px, 1024px, 1440px
- [ ] All pages render correctly on mobile, tablet, desktop
- [ ] Dark mode works across all sections
- [ ] All links functional (no dead links)
- [ ] Forms submit correctly with validation
- [ ] No console errors or warnings
- [ ] Favicon and app icons configured
- [ ] 404 page styled and functional
- [ ] Loading states for dynamic content
- [ ] Image alt text on every image
- [ ] UUPM anti-patterns avoided (check design system output)

---

## Iteration

When Chase requests changes:

1. Make the changes
2. Redeploy preview
3. Update the Kanban card with what was changed
4. Move card back to "In Review" if it was elsewhere

---

## Anti-Patterns (Hard Rules)

- Never use a component from two libraries for the same purpose within a project
- Never install Aceternity or Magic UI as npm packages — copy-paste-own model only
- Never use components unchanged from any library — always customize to match client theme
- Never mix animation libraries — Framer Motion is the only animation engine
- Never use generic fonts (Inter, Roboto, Arial, system fonts are banned)
- Never use Lorem Ipsum
- Never use emojis as icons
- Never use AI purple/pink gradient defaults
- Never skip the design system generation phase
- Never deploy to production without Chase's approval
- Never reuse the same design system across different clients without regenerating
