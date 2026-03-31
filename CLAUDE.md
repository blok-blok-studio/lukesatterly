# CLAUDE.md — BlokBlok Site Builder

This file provides guidance to Claude Code when working on any BlokBlok Studio client website project.

## Who We Are

BlokBlok Studio is a digital agency based in Berlin. Every site we build is a premium, custom website tailored to the client's brand. We do not generate templates. Chase Haynes (CEO) has final approval on all production deployments.

## Tech Stack

- **Framework**: Next.js (App Router), TypeScript, Tailwind CSS v4
- **Components**: shadcn/ui (base) + Aceternity UI (sections) + Magic UI (accents) + Radix UI (accessible primitives)
- **Animation**: Framer Motion only. No other animation library.
- **CMS**: Sanity (default). Contentful/Strapi if client requires.
- **Hosting**: Vercel
- **Video**: Remotion + ElevenLabs TTS
- **Design Intelligence**: UI UX Pro Max (uipro-cli)

## Build Workflow

Every client build follows this sequence. Do not skip steps.

### 1. Design System Generation (MANDATORY FIRST STEP)

Before writing any code, generate the design system:

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<industry keywords>" \
  --design-system --persist \
  -p "<Client Name>" \
  -f markdown
```

This creates `design-system/MASTER.md` with: landing page pattern, UI style, color palette, typography pairing, key effects, anti-patterns, and pre-delivery checklist.

When building a specific page, check if `design-system/pages/<page-name>.md` exists. If yes, its rules override the Master. If not, use Master exclusively.

### 2. Theme Configuration

Translate UUPM output into `config/theme.config.ts`. Every project gets unique fonts and colors. If the client has existing brand guidelines, those override UUPM output for colors and logo usage, but UUPM still informs layout pattern, effects, and anti-patterns.

### 3. Page Assembly

Pages are stacked section components with `variant` props. Choose variants based on the UUPM-recommended style. Use the component decision tree:

- Basic UI elements → shadcn/ui
- Accessible primitives not in shadcn → Radix UI
- Visual-impact sections (hero, testimonials, pricing) → Aceternity UI first, custom if no match
- Animated accents (counters, text effects, particles) → Magic UI
- Quick structural blocks → Preline/HyperUI
- Complex patterns (calendar, kanban, sidebar) → awesome-shadcn-ui ecosystem
- Fully custom → Tailwind + Framer Motion

### 4. CMS, SEO, Performance, Deploy

Standard Sanity schemas. SEO meta on every page. Lighthouse 90+ performance, 95+ accessibility. Deploy preview to Vercel, create Kanban card, share URL with Chase. **Never deploy production without Chase's explicit approval.**

## Design Rules (Non-Negotiable)

### Banned
- Inter, Roboto, Arial, system fonts, Space Grotesk as defaults
- AI purple/pink gradient schemes
- Lorem Ipsum anywhere
- Emojis used as icons (use Lucide, Heroicons, or custom SVG)
- Components used unchanged from any library
- Mixing animation libraries (Framer Motion only)
- Installing Aceternity or Magic UI as npm packages (copy-paste-own only)
- Cookie-cutter layouts with no visual variation between sections
- Solid white or solid dark backgrounds without texture/depth
- Reusing the same design system across different clients

### Spacing & Layout (Universal)
- Full-bleed sections (heroes, banners, image CTAs) must have ZERO outer padding/margin — they span edge to edge
- Contained sections (cards, forms, text blocks) use consistent outer padding: `py-8 sm:py-12 px-4 sm:px-6` with inner containers capped at `max-w-7xl mx-auto`
- Never wrap a full-bleed visual section in a padded container — it creates visible gaps between the content and viewport edges
- Adjacent dark-on-dark sections must not have visible seams; use matching backgrounds or gradients to blend
- Section vertical rhythm: use consistent spacing tokens, never mix arbitrary values between adjacent sections

### Required
- cursor-pointer on all clickable elements
- Hover states with smooth transitions (150-300ms)
- Light mode text contrast 4.5:1 minimum (WCAG AA)
- Visible focus states for keyboard navigation
- prefers-reduced-motion respected on all animations
- Responsive tested at: 375px, 768px, 1024px, 1440px
- All images via next/image with proper sizing and alt text
- CSS variables for all colors (no hardcoded hex in components)
- Code-split routes with dynamic imports for heavy components

### Design Philosophy
- Every project gets a unique, deliberate aesthetic direction
- Ask: "What will someone remember about this site after closing the tab?"
- Bold maximalism and refined minimalism both work — the key is intentionality
- Dominant colors with sharp accents beat evenly-distributed palettes
- One orchestrated page-load animation beats scattered micro-interactions
- Break the grid intentionally. Not every section should be centered max-width prose.
- Create atmosphere with gradient meshes, noise textures, grain overlays, or WebGL shaders where the design calls for it
- Match implementation complexity to the aesthetic vision

## Component Sources (All Free)

| Layer | Source | Use For |
|-------|--------|---------|
| 1 | shadcn/ui | All primitives: buttons, inputs, forms, dialogs |
| 1.5 | Radix UI | Accessible patterns shadcn doesn't cover |
| 2 | Aceternity UI | Hero sections, testimonials, pricing, feature grids |
| 3 | Magic UI | Animated counters, text effects, particles, marquees |
| 4 | Preline / HyperUI | Quick structural layout blocks |
| Browse | awesome-shadcn-ui | Community components: calendars, kanban, data tables |

21st.dev ($20/mo) is optional for inspiration browsing. Never required.

## Premium Effects (Use When Design Direction Warrants)

- WebGL shader backgrounds → Three.js / @react-three/fiber (luxury/tech/creative heroes)
- Particle systems → tsParticles or custom Canvas (SaaS, tech heroes)
- Scroll-driven animation → Framer Motion useScroll + useTransform
- 3D product viewers → @react-three/drei (e-commerce)
- Kinetic typography → Framer Motion layoutId + stagger (hero headlines)
- Noise/grain overlays → CSS filter or SVG feTurbulence (film, vintage aesthetics)

## File Structure Conventions

```
config/
  theme.config.ts        # UUPM-generated theme (colors, fonts, effects)
  site.ts                # Client business info (name, social, contact)
design-system/
  MASTER.md              # UUPM design system output (source of truth)
  pages/                 # Page-specific overrides
components/
  sections/              # Page section components (Hero, Features, CTA, etc.)
  ui/                    # shadcn/ui base components
  shared/                # Shared layout components (Navbar, Footer, etc.)
lib/
  cms.ts                 # CMS client and queries
  utils.ts               # Utility functions
app/
  (routes)/              # Next.js App Router pages
  layout.tsx             # Root layout with fonts, theme provider
  globals.css            # Tailwind imports + CSS variables
```

## Quality Checklist (Pre-Review)

Run through before submitting any preview build:

- Design system generated and MASTER.md exists
- Theme config matches UUPM output
- No banned fonts, no emoji icons, no Lorem Ipsum
- All interactive elements: cursor-pointer, hover transitions, focus states
- WCAG AA contrast on all text
- prefers-reduced-motion respected
- Responsive at 375px, 768px, 1024px, 1440px
- Dark mode functional across all sections
- No dead links, no console errors
- Favicon and OG images configured
- 404 page styled
- Loading states for dynamic content
- UUPM anti-patterns checklist passed

## Search Commands (Quick Reference)

```bash
# Full design system generation
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "keywords" --design-system -p "Name"

# Domain-specific lookups
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --domain style
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --domain typography
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --domain color
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --domain chart

# Stack-specific guidelines
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --stack react
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "query" --stack html-tailwind
```