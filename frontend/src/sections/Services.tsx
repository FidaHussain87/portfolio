import { useRef, useEffect, useState } from 'react'
import { gsap } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { Container } from '@components/layout'
import { SectionHeading, Card, GlowOrb, ParallaxLayer } from '@components/ui'
import { services } from '@data/index'
import type { Service } from '@data/index'
import {
  Code2,
  Brain,
  Cloud,
  Cpu,
  MessageSquareCode,
  type LucideIcon,
} from 'lucide-react'

// ─── Icon Map ────────────────────────────────────────────────────────────────

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Brain,
  Cloud,
  Cpu,
  MessageSquareCode,
}

// ─── Service Card ────────────────────────────────────────────────────────────

interface ServiceCardProps {
  service: (typeof services)[number]
  index: number
}

function ServiceCard({ service, index }: ServiceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const iconRef = useRef<HTMLDivElement>(null)
  const [hasHover, setHasHover] = useState(false)
  const number = String(index + 1).padStart(2, '0')
  const IconComponent = iconMap[service.icon]

  // Use gsap.matchMedia to detect hover capability
  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(hover: hover)', () => {
      setHasHover(true)
      return () => { setHasHover(false) }
    })
    return () => { mm.revert() }
  }, [])

  const handleMouseEnter = () => {
    if (!cardRef.current || !hasHover) return
    gsap.to(cardRef.current, {
      y: -10,
      rotateX: -2,
      rotateY: 2,
      boxShadow: '0 0 40px rgba(0,229,219,0.12)',
      transformPerspective: 800,
      duration: 0.35,
      ease: 'power2.out',
    })
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.1,
        duration: 0.35,
        ease: 'back.out(1.7)',
      })
    }
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      y: 0,
      rotateX: 0,
      rotateY: 0,
      boxShadow: '0 0 0px rgba(0,0,0,0)',
      duration: 0.45,
      ease: 'power3.out',
    })
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        duration: 0.35,
        ease: 'power2.out',
      })
    }
  }

  return (
    <div
      ref={cardRef}
      className="service-card will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card
        className={cn(
          'relative overflow-hidden p-4 sm:p-6 lg:p-8 h-full',
          'transition-[border-color] duration-300',
          'hover:border-primary-500/20'
        )}
      >
        {/* Large background number */}
        <span
          data-ghost-number
          className={cn(
            'absolute -top-4 -right-2 text-7xl lg:text-8xl font-bold leading-none select-none pointer-events-none',
            'text-[var(--text-primary)] opacity-[0.06]'
          )}
          aria-hidden="true"
        >
          {number}
        </span>

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          {IconComponent && (
            <div
              ref={iconRef}
              data-icon-orb
              className={cn(
                'inline-flex items-center justify-center w-12 h-12 mb-5 rounded-xl',
                'bg-primary-500/15 text-primary-400'
              )}
            >
              <IconComponent className="w-6 h-6" />
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl lg:text-2xl font-heading font-bold text-[var(--text-primary)] mb-3">
            {service.title}
          </h3>

          {/* Description */}
          <p className="text-[var(--text-secondary)] leading-relaxed mb-5">
            {service.description}
          </p>

          {/* Highlights */}
          {service.highlights.length > 0 && (
            <ul className="service-highlights space-y-2">
              {service.highlights.map((highlight: string) => (
                <li
                  key={highlight}
                  className="service-highlight flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                >
                  <span className="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500/60" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  )
}

// ─── Services Section ────────────────────────────────────────────────────────

export function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const grid = gridRef.current
    if (!section || !grid) return

    const mm = gsap.matchMedia()

    mm.add(
      {
        isDesktop: '(min-width: 1024px) and (hover: hover)',
        isMobile: '(max-width: 1023px)',
        prefersMotion: '(prefers-reduced-motion: no-preference)',
        prefersReduced: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { prefersReduced } = context.conditions!

        const cards = grid.querySelectorAll<HTMLElement>('.service-card')
        if (cards.length === 0) return

        if (prefersReduced) {
          gsap.from(cards, {
            opacity: 0,
            duration: 0.5,
            scrollTrigger: {
              trigger: grid,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          })
          return
        }

        // ── Choreographed entrance: alternating x-directions ──
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: grid,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })

        tl.addLabel('cardsStart')

        cards.forEach((card, i) => {
          // Left card from x:-40, center from y:50, right from x:40
          const isLeft = i % 3 === 0
          const isCenter = i % 3 === 1
          const xVal = isLeft ? -40 : isCenter ? 0 : 40
          const yVal = isCenter ? 50 : 20

          tl.from(
            card,
            {
              opacity: 0,
              x: xVal,
              y: yVal,
              scale: 0.9,
              filter: 'blur(4px)',
              duration: 0.7,
              ease: 'power3.out',
            },
            'cardsStart+=' + (i * 0.12)
          )

          if (i === 0) {
            tl.addLabel('iconsStart', 'cardsStart+=0.35')
          }

          // ── Icon "boot up" after card enters ──
          const iconOrb = card.querySelector('[data-icon-orb]')
          if (iconOrb) {
            tl.from(
              iconOrb,
              {
                scale: 0,
                rotation: -90,
                opacity: 0,
                duration: 0.5,
                ease: 'back.out(2)',
              },
              'cardsStart+=' + (i * 0.12 + 0.35)
            )
            // Brief glow flash
            tl.fromTo(
              iconOrb,
              { boxShadow: '0 0 0px rgba(0,229,219,0)' },
              {
                boxShadow: '0 0 20px rgba(0,229,219,0.4)',
                duration: 0.3,
                yoyo: true,
                repeat: 1,
                ease: 'power2.inOut',
              },
              'cardsStart+=' + (i * 0.12 + 0.65)
            )
          }

          if (i === 0) {
            tl.addLabel('highlightsStart', 'cardsStart+=0.5')
          }

          // ── Highlight list stagger ──
          const highlights = card.querySelectorAll('.service-highlight')
          if (highlights.length) {
            tl.from(
              highlights,
              {
                opacity: 0,
                x: -20,
                duration: 0.4,
                stagger: 0.08,
                ease: 'power3.out',
              },
              'cardsStart+=' + (i * 0.12 + 0.5)
            )
          }
        })

        // ── Ghost number parallax (scrub-driven) ──
        cards.forEach((card) => {
          const ghostNum = card.querySelector('[data-ghost-number]')
          if (ghostNum) {
            gsap.to(ghostNum, {
              y: -25,
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
      }
    )

    return () => {
      mm.revert()
    }
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Ambient GlowOrbs with parallax */}
      <ParallaxLayer speed={-0.2}>
        <GlowOrb
          color="secondary"
          size={350}
          className="-top-40 -left-40"
        />
      </ParallaxLayer>
      <ParallaxLayer speed={0.15}>
        <GlowOrb
          color="primary"
          size={300}
          className="-bottom-32 -right-32"
        />
      </ParallaxLayer>

      <Container className="relative z-10">
        <SectionHeading label="WHAT I DO" title="Services" />

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service: Service, index: number) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </Container>
    </section>
  )
}
