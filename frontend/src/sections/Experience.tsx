import { useRef, useEffect } from 'react'
import { gsap } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { Container } from '@components/layout'
import { SectionHeading, Badge, GlowOrb } from '@components/ui'
import { experience } from '@data/index'
import type { ExperienceEntry } from '@data/index'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPeriod(start: string, end: string | null): string {
  const fmt = (raw: string) => {
    const [year, month] = raw.split('-')
    const date = new Date(Number(year), Number(month) - 1)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  return `${fmt(start)} - ${end ? fmt(end) : 'Present'}`
}

function extractYear(dateStr: string): string {
  return dateStr.split('-')[0]
}

// ─── Experience Card ──────────────────────────────────────────────────────────

interface ExperienceCardProps {
  entry: ExperienceEntry
  index: number
  className?: string
}

function ExperienceCard({ entry, index, className }: ExperienceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const number = String(index + 1).padStart(2, '0')

  const handleMouseEnter = () => {
    if (!cardRef.current || window.matchMedia('(hover: none)').matches) return
    gsap.to(cardRef.current, {
      y: -6,
      boxShadow: '0 0 40px rgba(0,229,219,0.12)',
      borderColor: 'rgba(0,229,219,0.2)',
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 0 0px rgba(0,0,0,0)',
      clearProps: 'borderColor',
      duration: 0.45,
      ease: 'power3.out',
    })
  }

  return (
    <div
      ref={cardRef}
      data-experience-card
      className={cn(
        'relative rounded-2xl will-change-transform',
        'bg-[var(--glass-bg)] backdrop-blur-[10px]',
        'border border-[var(--glass-border)]',
        'p-5 sm:p-6 lg:p-8',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ghost number */}
      <span
        data-ghost-number
        className={cn(
          'absolute -top-3 -right-1 text-6xl sm:text-7xl lg:text-8xl font-heading font-bold leading-none',
          'text-[var(--text-primary)] opacity-[0.04] select-none pointer-events-none'
        )}
        aria-hidden="true"
      >
        {number}
      </span>

      {/* Company & Role */}
      <div className="mb-3">
        <h3
          className={cn(
            'text-lg sm:text-xl font-bold leading-tight',
            'text-[var(--text-primary)]'
          )}
        >
          {entry.role}
        </h3>
        <p className="mt-1 text-sm font-medium text-primary-400">
          {entry.company}
        </p>
      </div>

      {/* Period & Location */}
      <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-tertiary)]">
        <span className="font-mono">
          {formatPeriod(entry.period.start, entry.period.end)}
        </span>
        <span>{entry.location}</span>
      </div>

      {/* Description */}
      <p className="mb-5 text-sm md:text-base leading-relaxed text-[var(--text-secondary)]">
        {entry.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-1.5" data-tech-badges>
        {entry.techStack.map((tech: string) => (
          <Badge key={tech} variant="primary">
            {tech}
          </Badge>
        ))}
      </div>
    </div>
  )
}

// ─── Timeline ────────────────────────────────────────────────────────────────

function Timeline() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        prefersMotion: '(prefers-reduced-motion: no-preference)',
        prefersReduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { prefersReduced } = context.conditions!

        const cards = container.querySelectorAll<HTMLElement>('[data-experience-card]')
        const dots = container.querySelectorAll<HTMLElement>('[data-timeline-dot]')
        const svgPath = container.querySelector<SVGPathElement>('[data-timeline-svg-path]')
        const svgPathMobile = container.querySelector<SVGPathElement>('[data-timeline-svg-path-mobile]')

        // ── SVG timeline trace (scrub-driven stroke draw via DrawSVG) ──
        const animateSvgPath = (path: SVGPathElement) => {
          gsap.fromTo(path,
            { drawSVG: '0%' },
            {
              drawSVG: '100%',
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: 'top 80%',
                end: 'bottom 20%',
                scrub: 1,
              },
            }
          )
        }

        if (svgPath) animateSvgPath(svgPath)
        if (svgPathMobile) animateSvgPath(svgPathMobile)

        if (prefersReduced) {
          gsap.from(cards, {
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          })
          return
        }

        // ── Enhanced card entrance with blur + rotateY ──
        cards.forEach((card, i) => {
          const isEven = i % 2 === 0

          gsap.from(card, {
            opacity: 0,
            x: isEven ? -60 : 60,
            y: 20,
            filter: 'blur(4px)',
            rotateY: isEven ? -8 : 8,
            transformPerspective: 1000,
            duration: 0.9,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })

          // ── Tech badge stagger ──
          const badges = card.querySelector('[data-tech-badges]')
          if (badges) {
            const badgeEls = badges.children
            gsap.from(badgeEls, {
              opacity: 0,
              y: 10,
              scale: 0.9,
              duration: 0.4,
              stagger: 0.05,
              delay: 0.4,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            })
          }

          // ── Ghost number parallax ──
          const ghostNum = card.querySelector('[data-ghost-number]')
          if (ghostNum) {
            gsap.to(ghostNum, {
              y: -30,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            })
          }
        })

        // ── Dots pop in with pulse ring ──
        dots.forEach((dot) => {
          gsap.from(dot, {
            scale: 0,
            duration: 0.5,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: dot,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          })

          // ── Pulse ring effect ──
          const ring = dot.querySelector('[data-pulse-ring]')
          if (ring) {
            gsap.to(ring, {
              scale: 2.5,
              opacity: 0,
              duration: 1.5,
              ease: 'power2.out',
              repeat: -1,
              repeatDelay: 1.5,
              scrollTrigger: {
                trigger: dot,
                start: 'top 85%',
                toggleActions: 'play none none none',
              },
            })
          }
        })
      }
    )

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative">
      {/* SVG timeline line — desktop */}
      <svg
        className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[2px] h-full -translate-x-1/2 overflow-visible pointer-events-none"
      >
        <path
          data-timeline-svg-path
          d="M 1,0 L 1,10000"
          fill="none"
          stroke="url(#timeline-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,219,0.5))' }}
        />
        <defs>
          <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,229,219,0.6)" />
            <stop offset="50%" stopColor="rgba(98,0,229,0.3)" />
            <stop offset="100%" stopColor="rgba(0,229,219,0)" />
          </linearGradient>
        </defs>
      </svg>

      {/* SVG timeline line — mobile */}
      <svg
        className="lg:hidden absolute left-3 sm:left-4 md:left-5 top-0 bottom-0 w-[2px] h-full overflow-visible pointer-events-none"
      >
        <path
          data-timeline-svg-path-mobile
          d="M 1,0 L 1,10000"
          fill="none"
          stroke="url(#timeline-gradient-mobile)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ filter: 'drop-shadow(0 0 6px rgba(0,229,219,0.5))' }}
        />
        <defs>
          <linearGradient id="timeline-gradient-mobile" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,229,219,0.6)" />
            <stop offset="50%" stopColor="rgba(98,0,229,0.3)" />
            <stop offset="100%" stopColor="rgba(0,229,219,0)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="space-y-8 sm:space-y-10 lg:space-y-16">
        {experience.map((entry: ExperienceEntry, index: number) => {
          const isEven = index % 2 === 0

          return (
            <div
              key={entry.id}
              className={cn(
                'relative',
                // Mobile/tablet: single column with left padding for line
                'pl-10 sm:pl-12 md:pl-14',
                // Desktop: two-column alternating layout
                'lg:pl-0 lg:flex lg:items-start lg:gap-8',
                isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
              )}
            >
              {/* ── Timeline dot — mobile (on left line) ── */}
              <div
                data-timeline-dot
                className={cn(
                  'lg:hidden absolute left-1.5 sm:left-2.5 md:left-3.5 top-6',
                  'flex items-center justify-center'
                )}
              >
                <div className="relative">
                  <div
                    className={cn(
                      'h-3 w-3 rounded-full',
                      'bg-gradient-to-br from-primary-500 to-secondary-500',
                      'ring-4 ring-[var(--bg-primary)]',
                      'shadow-[0_0_10px_rgba(0,229,219,0.35)]'
                    )}
                  />
                  {/* Pulse ring */}
                  <div
                    data-pulse-ring
                    className={cn(
                      'absolute inset-0 rounded-full',
                      'border-2 border-primary-500/60',
                      'pointer-events-none'
                    )}
                  />
                </div>
              </div>

              {/* ── Card ── */}
              <div className={cn('lg:w-[calc(50%-2rem)]')}>
                {/* Year label — mobile */}
                <span className="lg:hidden mb-2 inline-block text-xs font-mono font-semibold text-primary-400">
                  {extractYear(entry.period.start)}
                </span>

                <ExperienceCard entry={entry} index={index} />
              </div>

              {/* ── Center column: dot + year — desktop only ── */}
              <div className="hidden lg:flex flex-col items-center flex-shrink-0 w-16 pt-6">
                <div
                  data-timeline-dot
                  className="relative"
                >
                  <div
                    className={cn(
                      'h-4 w-4 rounded-full',
                      'bg-gradient-to-br from-primary-500 to-secondary-500',
                      'ring-4 ring-[var(--bg-primary)]',
                      'shadow-[0_0_12px_rgba(0,229,219,0.4)]'
                    )}
                  />
                  {/* Pulse ring */}
                  <div
                    data-pulse-ring
                    className={cn(
                      'absolute inset-0 rounded-full',
                      'border-2 border-primary-500/60',
                      'pointer-events-none'
                    )}
                  />
                </div>
                <span className="mt-2 text-xs font-mono font-semibold text-primary-400">
                  {extractYear(entry.period.start)}
                </span>
              </div>

              {/* ── Spacer for the other side — desktop only ── */}
              <div className="hidden lg:block lg:w-[calc(50%-2rem)]" />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Experience Section ───────────────────────────────────────────────────────

export function Experience() {
  return (
    <section
      id="experience"
      className="section-padding relative overflow-hidden"
    >
      {/* Background decoration */}
      <GlowOrb
        color="secondary"
        size={450}
        className="-top-48 -left-48"
      />
      <GlowOrb
        color="primary"
        size={350}
        className="-bottom-40 -right-40"
      />

      <Container className="relative z-10">
        <SectionHeading label="JOURNEY" title="Work Experience" />
        <Timeline />
      </Container>
    </section>
  )
}
