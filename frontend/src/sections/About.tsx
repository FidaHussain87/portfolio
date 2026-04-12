import { useRef, useEffect, useCallback } from 'react'
import { gsap } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { Container } from '@components/layout'
import {
  AnimatedCounter,
  GlowOrb,
  GeometricShape,
  ScrollText,
} from '@components/ui'
import { personalInfo } from '@data/index'
import { useSectionEntrance } from '@hooks/useSectionEntrance'

// ─── Stats Data ───────────────────────────────────────────────────────────────

const stats = [
  { value: 6, suffix: '+', label: 'Years Experience' },
  { value: 86, suffix: '+', label: 'GitHub Repos' },
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: null, label: 'Fiverr Badge', badge: 'Top Rated' },
] as const

// ─── Avatar Frame with 3D Tilt ───────────────────────────────────────────────

function AvatarFrame() {
  const frameRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const frame = frameRef.current
      if (!frame) return

      const rect = frame.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -12
      const rotateY = ((x - centerX) / centerX) * 12

      gsap.to(frame, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      })

      // Move glow to follow cursor
      if (glowRef.current) {
        gsap.to(glowRef.current, {
          x: (x - centerX) * 0.3,
          y: (y - centerY) * 0.3,
          duration: 0.4,
          ease: 'power2.out',
        })
      }
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    const frame = frameRef.current
    if (!frame) return

    gsap.to(frame, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    })

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
      })
    }
  }, [])

  return (
    <div
      className="relative w-full max-w-md mx-auto"
      style={{ perspective: 800 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Decorative geometric lines behind the frame */}
      <div className="absolute -inset-4 md:-inset-6">
        {/* Top-right corner accent */}
        <div
          className="absolute -top-2 -right-2 w-20 h-20 border-t-2 border-r-2 rounded-tr-2xl"
          style={{ borderColor: 'var(--color-primary-500)' }}
        />
        {/* Bottom-left corner accent */}
        <div
          className="absolute -bottom-2 -left-2 w-20 h-20 border-b-2 border-l-2 rounded-bl-2xl"
          style={{ borderColor: 'var(--color-secondary-500)' }}
        />
        {/* Dashed side accents */}
        <div
          className="absolute top-1/4 -left-3 w-6 h-px"
          style={{ background: 'var(--color-primary-400)', opacity: 0.5 }}
        />
        <div
          className="absolute bottom-1/4 -right-3 w-6 h-px"
          style={{ background: 'var(--color-secondary-400)', opacity: 0.5 }}
        />
      </div>

      {/* Main avatar frame */}
      <div
        ref={frameRef}
        className={cn(
          'relative rounded-2xl overflow-hidden',
          'aspect-[4/5] w-full min-h-[300px]',
          'will-change-transform'
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Gradient border */}
        <div
          className="absolute inset-0 rounded-2xl p-[2px]"
          style={{
            background:
              'linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500), var(--color-accent-500))',
          }}
        >
          <div className="w-full h-full rounded-2xl bg-[var(--bg-secondary)]" />
        </div>

        {/* Profile image */}
        <div
          className={cn(
            'absolute inset-[2px] rounded-2xl overflow-hidden',
            'bg-[var(--bg-tertiary)]'
          )}
        >
          <img
            src="/images/FidaHussain.jpeg"
            alt="Fida Hussain"
            className="w-full h-full object-cover"
          />

          {/* Floating glow that follows cursor */}
          <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              background:
                'radial-gradient(circle at 50% 50%, var(--color-primary-500) 0%, transparent 60%)',
            }}
          />
        </div>
      </div>

      {/* Floating accent elements around avatar */}
      <GeometricShape
        variant="triangle"
        size={24}
        color="var(--color-primary-500)"
        className="-top-6 -right-6 opacity-40 animate-float"
        rotate={20}
      />
      <GeometricShape
        variant="hexagon"
        size={20}
        color="var(--color-secondary-500)"
        className="-bottom-4 -left-6 opacity-30 animate-float"
        rotate={-15}
        strokeWidth={1}
      />
      <GeometricShape
        variant="circle"
        size={16}
        color="var(--color-accent-400)"
        className="top-1/3 -right-8 opacity-25"
      />
      <GlowOrb
        color="primary"
        size={120}
        className="-bottom-10 -right-10 opacity-15"
      />
      <GlowOrb
        color="secondary"
        size={100}
        className="-top-8 -left-8 opacity-10"
      />
    </div>
  )
}

// ─── About Section ────────────────────────────────────────────────────────────

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const entranceRef = useSectionEntrance<HTMLDivElement>('clipRevealUp')

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // Animate avatar frame
      gsap.from('.about-avatar', {
        scale: 0.9,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      })

      // Animate stat cards stagger
      gsap.from('.about-stat', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-stats-grid',
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // ── Pinned progressive reveal on desktop ────────────────────────
      if (!prefersReduced) {
        const mm = gsap.matchMedia()

        mm.add('(min-width: 1024px)', () => {
          const heading = section.querySelector('.about-heading')
          const bioText = section.querySelector('.scroll-text')
          const statsGrid = section.querySelector('.about-stats-grid')
          const avatar = section.querySelector('.about-avatar')

          const revealElements = [heading, bioText, statsGrid, avatar].filter(
            Boolean
          ) as HTMLElement[]

          if (revealElements.length === 0) return

          // Set initial state for pinned reveal elements
          gsap.set(revealElements, { opacity: 0, y: 60 })

          const pinTl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              pin: true,
              start: 'top top',
              end: '+=150%',
              scrub: 1,
            },
          })

          revealElements.forEach((el, i) => {
            const position = i * 0.2
            pinTl.to(
              el,
              {
                opacity: 1,
                y: 0,
                duration: 0.25,
                ease: 'power3.out',
              },
              position
            )
          })
        })
      }
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="section-padding relative overflow-hidden"
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Right side on desktop, second on mobile: Avatar */}
          <div className="about-avatar order-2 lg:order-2 lg:col-span-2">
            <AvatarFrame />
          </div>

          {/* Left side on desktop, first on mobile: Text content */}
          <div ref={entranceRef} className="order-1 lg:order-1 lg:col-span-3 space-y-8">
            {/* Heading */}
            <h2
              className={cn(
                'about-heading',
                'text-3xl sm:text-4xl md:text-5xl lg:text-6xl',
                'font-heading font-bold',
                'text-gradient'
              )}
            >
              About Me
            </h2>

            {/* Bio text — scroll-scrubbed word reveal */}
            <ScrollText
              className={cn(
                'text-base md:text-lg leading-relaxed',
                'max-w-2xl'
              )}
            >
              {personalInfo.bio}
            </ScrollText>

            {/* Stats grid */}
            <div className="about-stats-grid grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 max-w-lg pt-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className={cn(
                    'about-stat',
                    'p-3 sm:p-4 md:p-5 rounded-xl',
                    'bg-[var(--glass-bg)] border border-[var(--glass-border)]',
                    'backdrop-blur-sm',
                    'transition-colors duration-300',
                    'hover:border-[var(--border-strong)]'
                  )}
                >
                  {stat.value !== null ? (
                    <AnimatedCounter
                      end={stat.value}
                      suffix={stat.suffix}
                      className={cn(
                        'text-2xl sm:text-3xl md:text-4xl font-heading font-bold',
                        'text-gradient-primary'
                      )}
                    />
                  ) : (
                    <span
                      className={cn(
                        'text-xl sm:text-2xl md:text-3xl font-heading font-bold',
                        'text-gradient-primary'
                      )}
                    >
                      {stat.badge}
                    </span>
                  )}
                  <p className="mt-1 text-sm text-[var(--text-tertiary)] font-body">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
