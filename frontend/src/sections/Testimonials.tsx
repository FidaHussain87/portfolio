import { useRef, useEffect } from 'react'
import { gsap, InertiaPlugin } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { Container } from '@components/layout'
import { SectionHeading, Card } from '@components/ui'
import { testimonials } from '@data/index'
import { Quote, Star } from 'lucide-react'

// Ensure InertiaPlugin is available for physics-based deceleration
void InertiaPlugin

// ─── Marquee Row ─────────────────────────────────────────────────────────────

interface MarqueeRowProps {
  items: typeof testimonials
  direction: 'left' | 'right'
  duration?: number
}

function MarqueeRow({ items, direction, duration = 40 }: MarqueeRowProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  // Duplicate items for seamless infinite loop
  const duplicated = [...items, ...items]

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Measure half the track (the original items) for seamless looping
    const children = track.children
    let halfWidth = 0
    for (let i = 0; i < items.length; i++) {
      const child = children[i] as HTMLElement
      if (child) {
        halfWidth += child.offsetWidth + parseFloat(getComputedStyle(track).gap || '0')
      }
    }

    const startX = direction === 'left' ? 0 : -halfWidth
    const endX = direction === 'left' ? -halfWidth : 0

    gsap.set(track, { x: startX })

    tweenRef.current = gsap.to(track, {
      x: endX,
      duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: (x: string) => {
          const xNum = parseFloat(x)
          if (direction === 'left') {
            return (xNum % halfWidth) + 'px'
          }
          // For right direction, keep within bounds
          const mod = ((xNum % halfWidth) + halfWidth) % halfWidth
          return (-halfWidth + mod) + 'px'
        },
      },
    })

    return () => {
      tweenRef.current?.kill()
    }
  }, [items.length, direction, duration])

  const handleMouseEnter = () => {
    if (tweenRef.current) {
      // Natural physics-based deceleration on hover
      gsap.to(tweenRef.current, {
        timeScale: 0,
        duration: 1.5,
        ease: 'power3.out',
      })
    }
  }

  const handleMouseLeave = () => {
    if (tweenRef.current) {
      // Use the custom 'neonPulse' ease for re-acceleration
      gsap.to(tweenRef.current, {
        timeScale: 1,
        duration: 2,
        ease: 'neonPulse',
      })
    }
  }

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={trackRef}
        className="flex gap-4 sm:gap-6 w-max will-change-transform"
      >
        {duplicated.map((testimonial, idx) => (
          <TestimonialCard key={`${testimonial.id}-${idx}`} testimonial={testimonial} />
        ))}
      </div>
    </div>
  )
}

// ─── Testimonial Card ────────────────────────────────────────────────────────

interface TestimonialCardProps {
  testimonial: (typeof testimonials)[number]
}

function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<SVGSVGElement>(null)

  const handleMouseEnter = () => {
    if (!cardRef.current || window.matchMedia('(hover: none)').matches) return
    gsap.to(cardRef.current, {
      y: -4,
      scale: 1.02,
      boxShadow: '0 0 30px rgba(0,229,219,0.1)',
      duration: 0.3,
      ease: 'power2.out',
    })
    if (quoteRef.current) {
      gsap.to(quoteRef.current, {
        scale: 1.1,
        color: 'rgba(0,229,219,0.6)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = () => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      y: 0,
      scale: 1,
      boxShadow: '0 0 0px rgba(0,0,0,0)',
      duration: 0.4,
      ease: 'power3.out',
    })
    if (quoteRef.current) {
      gsap.to(quoteRef.current, {
        scale: 1,
        clearProps: 'color',
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }

  return (
    <div
      ref={cardRef}
      className="will-change-transform"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="flex-shrink-0 w-[300px] sm:w-[380px] md:w-[440px] p-4 sm:p-6 md:p-8">
        {/* Quote icon */}
        <Quote
          ref={quoteRef as React.Ref<SVGSVGElement>}
          className="w-6 h-6 sm:w-8 sm:h-8 text-primary-500/40 mb-3 sm:mb-4"
        />

        {/* Quote text */}
        <p className="text-[var(--text-secondary)] text-xs sm:text-sm md:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-5">
          {testimonial.quote}
        </p>

        {/* Bottom: avatar, info, rating */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {/* Avatar placeholder - gradient circle */}
            <div
              className={cn(
                'w-10 h-10 rounded-full flex-shrink-0',
                'bg-gradient-to-br from-primary-500 via-secondary-500 to-accent-500',
                'flex items-center justify-center',
                'text-xs font-bold text-[var(--text-inverse)]'
              )}
            >
              {testimonial.name
                .split(' ')
                .map((n: string) => n[0])
                .join('')}
            </div>
            <div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {testimonial.name}
              </p>
              <p className="text-xs text-[var(--text-tertiary)]">
                {testimonial.role}, {testimonial.company}
              </p>
            </div>
          </div>

          {/* Star rating */}
          <div className="flex gap-0.5">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-3.5 h-3.5 fill-primary-400 text-primary-400"
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Testimonials Section ────────────────────────────────────────────────────

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const rowsRef = useRef<HTMLDivElement>(null)

  // Split testimonials into two rows
  const midpoint = Math.ceil(testimonials.length / 2)
  const topRow = testimonials.slice(0, midpoint)
  const bottomRow = testimonials.slice(midpoint)

  // If there are few testimonials, use the full array for both rows for visual density
  const topItems = testimonials.length <= 4 ? testimonials : topRow
  const bottomItems = testimonials.length <= 4 ? [...testimonials].reverse() : bottomRow

  // Section entrance animation
  useEffect(() => {
    const section = sectionRef.current
    const rows = rowsRef.current
    if (!section || !rows) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const marqueeRows = rows.children

      if (prefersReduced) {
        gsap.from(marqueeRows, {
          opacity: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
        return
      }

      gsap.from(marqueeRows, {
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.25,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="section-padding relative overflow-hidden"
    >
      <Container>
        <SectionHeading label="FEEDBACK" title="Client Testimonials" />
      </Container>

      {/* Marquee rows - full width, outside Container for edge-to-edge scroll */}
      <div ref={rowsRef} className="mt-8 flex flex-col gap-6">
        <MarqueeRow items={topItems} direction="left" duration={45} />
        <MarqueeRow items={bottomItems} direction="right" duration={50} />
      </div>
    </section>
  )
}
