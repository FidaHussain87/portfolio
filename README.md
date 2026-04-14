# Fida Hussain — Portfolio

A cyberpunk-themed personal portfolio website showcasing 7+ years of full stack development experience across enterprise, SaaS, and cloud platforms.

**Live:** [fidahussain.dev](https://fidahussain.dev) (Vercel)

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Styling:** Tailwind CSS v4 with custom design system (dark/light themes)
- **Animations:** GSAP 3.14 with 11 premium plugins (ScrollTrigger, Flip, SplitText, ScrambleText, DrawSVG, MorphSVG, MotionPath, CustomEase, CustomBounce, CustomWiggle, Inertia)
- **Smooth Scroll:** Lenis
- **Build Tool:** Vite 6
- **Deployment:** Vercel
- **Contact Form:** EmailJS

## Sections

| Section | Description |
|---------|-------------|
| **Preloader** | Animated boot-sequence loading screen with ScrambleText |
| **Hero** | Full-viewport intro with gradient meshes, floating orbit particles, and text reveal |
| **About** | Bio, highlights, and professional summary |
| **Skills** | Interactive SVG radar chart + filterable skill cards with proficiency bars |
| **Experience** | Timeline of 7 roles with SVG trace line and tech stack badges |
| **Projects** | Featured projects (GMP, iEman, SBTi) with 3D card tilts and clip-path reveals |
| **Services** | Offered services with staggered card entrances |
| **Testimonials** | Marquee rows with hover-pause deceleration |
| **GitHub Activity** | Contribution heatmap grid and achievement badges |
| **Contact** | Contact form with SVG border-draw animations on focus |
| **Footer** | Social links and site credits |

## Project Structure

```
portfolio/
  frontend/          # React SPA
    src/
      components/    # Reusable UI components (Card, GlowOrb, SkillRadar, etc.)
      data/          # Static data (experience, projects, skills, personal info)
      design-system/ # Theme tokens and ThemeProvider
      hooks/         # Custom hooks (useTextReveal, useSectionEntrance, etc.)
      sections/      # Page sections (Hero, About, Skills, etc.)
      styles/        # Global CSS, fonts, scrollbar, noise textures
      utils/         # GSAP registration, cn() helper
```

## Getting Started

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

## Build

```bash
npm run build     # tsc -b && vite build → dist/
npm run preview   # Preview production build locally
```

## Author

**Fida Hussain** — Full Stack JavaScript Developer based in Germany

- [GitHub](https://github.com/FidaHussain87)
- [LinkedIn](https://linkedin.com/in/fidahussain87)
- [Email](mailto:fida.hussain0101199@gmail.com)
