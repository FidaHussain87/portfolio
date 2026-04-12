# Portfolio Frontend

React + TypeScript SPA with a cyberpunk design system, GSAP premium animations, and full dark/light theme support.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Type-check + production build |
| `npm run preview` | Serve production build locally |
| `npm run lint` | Run ESLint |

## Architecture

```
src/
  components/
    layout/         # Container, grid components
    ui/             # Card, GlowOrb, ParallaxLayer, SkillRadar, SkillIcon,
                    #   SectionHeading, MagneticWrapper, SectionDivider, etc.
  data/             # Static typed data
    experience.ts   # Work history (ExperienceEntry[])
    projects.ts     # Portfolio projects (Project[])
    skills.ts       # Skill categories + proficiencies (SkillCategory[])
    personal.ts     # Name, bio, social links, contact info
    services.ts     # Offered services
    testimonials.ts # Client testimonials
  design-system/
    tokens/         # Color palette, spacing, typography tokens
    theme/          # ThemeProvider (dark/light with system detection)
  hooks/            # useSectionEntrance, useTextReveal, useSmoothScroll, etc.
  sections/         # Full page sections (Hero, About, Skills, Experience, etc.)
  styles/
    globals.css     # Theme variables, base styles, @theme config
    fonts.css       # @font-face declarations (Space Grotesk, Inter, JetBrains Mono)
    noise.css       # Film grain noise overlay
    scrollbar.css   # Custom scrollbar styling
    utilities.css   # CSS utility classes and keyframes
  utils/
    gsap-register.ts  # GSAP plugin registration, custom eases, registered effects
    cn.ts              # clsx + tailwind-merge utility
```

## Design System

- **Theme:** CSS custom properties toggled via `data-theme="dark|light"` attribute
- **Colors:** Primary (Cyan), Secondary (Violet), Accent (Hot Pink), Neutral (Blue-tinted gray)
- **Light mode overrides:** Accent colors shift to darker, WCAG AA-compliant values
- **Typography:** Space Grotesk (headings), Inter (body), JetBrains Mono (code/numbers)

## GSAP Plugins

All 11 premium plugins are registered in `src/utils/gsap-register.ts`:

- **ScrollTrigger** — Scroll-driven entrances and scrub animations
- **Flip** — Layout transition animations on tab switches
- **SplitText** — Character/word-level text reveal animations
- **ScrambleText** — Cyberpunk character scramble effects
- **DrawSVG** — SVG stroke draw-on animations (contact form borders, section dividers)
- **MorphSVG** — SVG shape morphing
- **MotionPath** — Particle orbit paths (Hero section)
- **CustomEase / CustomBounce / CustomWiggle** — Custom easing curves (`cyberSnap`, `neonPulse`, `glitchIn`)
- **InertiaPlugin** — Momentum-based animations

## Path Aliases

Configured in both `tsconfig.app.json` and `vite.config.ts`:

| Alias | Path |
|-------|------|
| `@/*` | `src/*` |
| `@components/*` | `src/components/*` |
| `@sections/*` | `src/sections/*` |
| `@hooks/*` | `src/hooks/*` |
| `@utils/*` | `src/utils/*` |
| `@data/*` | `src/data/*` |
| `@styles/*` | `src/styles/*` |
| `@design-system/*` | `src/design-system/*` |

## Deployment

Deployed on Vercel. The build command is `npm run build` which runs `tsc -b && vite build`.

Environment variable for contact form: `VITE_EMAILJS_*` (see `.env.example`).
