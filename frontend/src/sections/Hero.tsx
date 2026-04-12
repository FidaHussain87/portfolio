import { useRef, useEffect, useCallback } from 'react'
import { gsap, ScrollTrigger, SplitText } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { Container } from '@components/layout'
import { Button } from '@components/ui'
import { personalInfo } from '@data/index'

// ─── Particle System Types ────────────────────────────────────────────────────

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseSize: number
  size: number
  opacity: number
  phase: number
  life?: number // for burst particles
  maxLife?: number
}

// ─── Interactive Particle Canvas ──────────────────────────────────────────────

function useParticleCanvas(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const animationFrameRef = useRef<number>(0)
  const particlesRef = useRef<Particle[]>([])
  const burstParticlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const timeRef = useRef(0)

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = []
    const count = Math.min(90, Math.floor((width * height) / 15000))

    for (let i = 0; i < count; i++) {
      const baseSize = Math.random() * 3 + 1.5
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.4,
        baseSize,
        size: baseSize,
        opacity: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
      })
    }

    particlesRef.current = particles
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)

      if (particlesRef.current.length === 0) {
        initParticles(canvas.offsetWidth, canvas.offsetHeight)
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 }
    }

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top

      for (let i = 0; i < 15; i++) {
        const angle = (Math.PI * 2 * i) / 15 + (Math.random() - 0.5) * 0.5
        const speed = 2 + Math.random() * 3
        burstParticlesRef.current.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseSize: 2 + Math.random() * 2,
          size: 2 + Math.random() * 2,
          opacity: 0.8,
          phase: 0,
          life: 0,
          maxLife: 40 + Math.random() * 20,
        })
      }
    }

    canvas.style.pointerEvents = 'auto'
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    canvas.addEventListener('click', handleClick)

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary-500')
      .trim() || '#00e5db'

    const animate = () => {
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      timeRef.current += 0.016

      ctx.clearRect(0, 0, w, h)

      const mouse = mouseRef.current
      const REPEL_RADIUS = 150
      const REPEL_STRENGTH = 0.8
      const CONNECT_DIST = 120

      // Update & draw main particles
      const particles = particlesRef.current
      for (const p of particles) {
        // Sinusoidal size pulsing
        p.size = p.baseSize + Math.sin(timeRef.current * 2 + p.phase) * 0.8

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_RADIUS && dist > 0) {
          const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH
          p.vx += (dx / dist) * force
          p.vy += (dy / dist) * force
        }

        // Damping
        p.vx *= 0.98
        p.vy *= 0.98

        p.x += p.vx
        p.y += p.vy

        // Wrap edges
        if (p.x < -20) p.x = w + 20
        if (p.x > w + 20) p.x = -20
        if (p.y < -20) p.y = h + 20
        if (p.y > h + 20) p.y = -20

        // Draw particle
        ctx.globalAlpha = p.opacity
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = primaryColor
        ctx.fill()
      }

      // Draw connecting lines
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.15
            ctx.globalAlpha = alpha
            ctx.strokeStyle = primaryColor
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Update & draw burst particles
      const burst = burstParticlesRef.current
      for (let i = burst.length - 1; i >= 0; i--) {
        const bp = burst[i]
        bp.life! += 1
        bp.x += bp.vx
        bp.y += bp.vy
        bp.vx *= 0.96
        bp.vy *= 0.96
        const progress = bp.life! / bp.maxLife!
        bp.opacity = 0.8 * (1 - progress)
        bp.size = bp.baseSize * (1 - progress * 0.5)

        if (bp.life! >= bp.maxLife!) {
          burst.splice(i, 1)
          continue
        }

        ctx.globalAlpha = bp.opacity
        ctx.beginPath()
        ctx.arc(bp.x, bp.y, bp.size, 0, Math.PI * 2)
        ctx.fillStyle = primaryColor
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      canvas.removeEventListener('click', handleClick)
    }
  }, [canvasRef, initParticles])
}

// ─── Scroll Indicator ─────────────────────────────────────────────────────────

function ScrollIndicator({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <span className="text-xs font-body uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
        Scroll
      </span>
      <div className="relative h-10 w-5 rounded-full border border-[var(--border-strong)]">
        <div className="scroll-chevron absolute left-1/2 top-1.5 h-2 w-2 -translate-x-1/2 rounded-full bg-primary-500" />
      </div>
    </div>
  )
}

// ─── Hero Section ─────────────────────────────────────────────────────────────

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const meshRef = useRef<HTMLDivElement>(null)
  const orbitDotsRef = useRef<(HTMLDivElement | null)[]>([])

  // Store SplitText instances for cleanup
  const nameSplitRef = useRef<InstanceType<typeof SplitText> | null>(null)
  const taglineSplitRef = useRef<InstanceType<typeof SplitText> | null>(null)

  // Canvas particle background
  useParticleCanvas(canvasRef)

  // ── MotionPath orbital particles ──────────────────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const dots = orbitDotsRef.current.filter(Boolean) as HTMLDivElement[]
    if (dots.length === 0) return

    // Elliptical orbit paths as SVG path data strings (MotionPathPlugin requires <path> data, not <ellipse>)
    // Each is a closed ellipse centered at (960,540) in a 1920x1080 coordinate space
    const orbitConfigs = [
      { path: 'M 960 540 m -730 0 a 730,422 -15 1,0 1460,0 a 730,422 -15 1,0 -1460,0', duration: 8, delay: 0 },
      { path: 'M 960 540 m -845 0 a 845,346 25 1,0 1690,0 a 845,346 25 1,0 -1690,0', duration: 12, delay: 1 },
      { path: 'M 960 540 m -576 0 a 576,538 -40 1,0 1152,0 a 576,538 -40 1,0 -1152,0', duration: 10, delay: 2 },
      { path: 'M 960 540 m -922 0 a 922,269 10 1,0 1844,0 a 922,269 10 1,0 -1844,0', duration: 14, delay: 0.5 },
      { path: 'M 960 540 m -653 0 a 653,384 55 1,0 1306,0 a 653,384 55 1,0 -1306,0', duration: 9, delay: 3 },
    ]

    const tweens: gsap.core.Tween[] = []

    dots.forEach((dot, i) => {
      if (!dot || !orbitConfigs[i]) return

      const config = orbitConfigs[i]
      const tween = gsap.to(dot, {
        motionPath: {
          path: config.path,
          alignOrigin: [0.5, 0.5],
          autoRotate: false,
        },
        duration: config.duration,
        repeat: -1,
        ease: 'none',
        delay: config.delay,
      })
      tweens.push(tween)
    })

    return () => {
      tweens.forEach((tw) => tw.kill())
    }
  }, [])

  // Gradient mesh mouse follow
  useEffect(() => {
    const mesh = meshRef.current
    if (!mesh) return

    const xTo = gsap.quickTo(mesh, '--gx', { duration: 0.8, ease: 'power2.out' })
    const yTo = gsap.quickTo(mesh, '--gy', { duration: 0.8, ease: 'power2.out' })

    const handleMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    }

    window.addEventListener('mousemove', handleMove)
    return () => window.removeEventListener('mousemove', handleMove)
  }, [])

  // Entrance timeline animation
  useEffect(() => {
    const section = sectionRef.current
    const nameEl = nameRef.current
    const taglineEl = taglineRef.current
    const ctaEl = ctaRef.current
    const scrollEl = scrollRef.current

    if (!section || !nameEl || !taglineEl || !ctaEl || !scrollEl) return

    let cancelled = false
    let ctx: gsap.Context | null = null

    document.fonts.ready.then(() => {
      if (cancelled) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Use SplitText for the name — split each line into chars, words, and lines
    const nameSplit = new SplitText(nameEl, { type: 'chars,words,lines' })
    nameSplitRef.current = nameSplit

    // All chars from the split
    const allLetters = nameSplit.chars

    // HUSSAIN letters: find chars belonging to the second .hero-name-line
    const nameLines = nameEl.querySelectorAll('.hero-name-line')
    const hussainLine = nameLines[1]
    const hussainLetters = hussainLine
      ? allLetters.filter((char: Element) => hussainLine.contains(char))
      : []

    // Use SplitText for the tagline instead of manual char splitting
    const taglineSplit = new SplitText(taglineEl, { type: 'chars' })
    taglineSplitRef.current = taglineSplit

    // Blinking cursor
    const cursor = document.createElement('span')
    cursor.textContent = '|'
    cursor.style.display = 'inline'
    cursor.classList.add('tagline-cursor')
    cursor.style.color = 'var(--color-primary-500)'
    cursor.style.fontWeight = '300'
    taglineEl.appendChild(cursor)

    ctx = gsap.context(() => {
      // Master entrance timeline
      const tl = gsap.timeline({ delay: 0.5 })

      if (prefersReduced) {
        // Reduced motion: simple fade
        tl.from(allLetters, { opacity: 0, duration: 0.5 })
        tl.to(taglineSplit.chars, { opacity: 1, duration: 0.3 }, '-=0.2')
        tl.from(ctaEl.children, { opacity: 0, duration: 0.3 }, '-=0.1')
        tl.from(scrollEl, { opacity: 0, duration: 0.3 })
        tl.to(cursor, { opacity: 0, duration: 0.1 })
      } else {
        // 1. Name chars: 3D flip from below with blur, stagger from center
        tl.from(allLetters, {
          y: 120,
          rotationX: 90,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.9,
          stagger: {
            each: 0.04,
            from: 'center',
          },
          ease: 'power3.out',
          transformPerspective: 800,
        })

        // 2. Brief scale pulse after letters land
        tl.to(allLetters, {
          scale: 1.02,
          duration: 0.2,
          ease: 'power2.inOut',
          yoyo: true,
          repeat: 1,
        }, '-=0.1')

        // 3. HUSSAIN gradient shift
        tl.to(hussainLetters, {
          backgroundPosition: '100% 50%',
          duration: 1.2,
          ease: 'power1.inOut',
        }, '-=0.3')

        // 4. Tagline: ScrambleText decode instead of simple opacity typewriter
        gsap.set(taglineSplit.chars, { opacity: 0 })
        tl.to(taglineSplit.chars, { opacity: 1, duration: 0.01, stagger: 0.01 }, '-=0.6')
        tl.to(taglineEl, {
          duration: 1.2,
          scrambleText: {
            text: '{original}',
            chars: '█▓▒░╱╲{}[]01',
            speed: 0.4,
            revealDelay: 0.3,
          },
        }, '-=0.8')

        // 5. Cursor blink then remove
        gsap.to(cursor, {
          opacity: 0,
          yoyo: true,
          repeat: -1,
          duration: 0.5,
          ease: 'steps(1)',
        })

        tl.to(cursor, {
          opacity: 0,
          duration: 0.1,
          delay: 1,
          onComplete: () => cursor.remove(),
        })

        // 6. CTA buttons fade up
        tl.from(
          ctaEl.children,
          {
            y: 40,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: 'power3.out',
          },
          '-=1'
        )

        // 7. Scroll indicator fades in
        tl.from(
          scrollEl,
          {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        )
      }

      // Bouncing scroll indicator loop
      gsap.to(scrollEl.querySelector('.scroll-chevron'), {
        y: 12,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      })

      // ── Scroll-driven parallax exit ──────────────────────────────────
      if (ScrollTrigger) {
        gsap.to(nameEl, {
          y: -150,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        gsap.to(taglineEl, {
          y: -80,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        })

        gsap.to(canvasRef.current, {
          opacity: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '70% top',
            scrub: true,
          },
        })

        gsap.to(section, {
          scale: 0.95,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: '50% top',
            end: 'bottom top',
            scrub: true,
          },
        })
      }
    }, section)

    }) // end document.fonts.ready

    return () => {
      cancelled = true
      ctx?.revert()
      nameSplitRef.current?.revert()
      taglineSplitRef.current?.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Gradient mesh background */}
      <div
        ref={meshRef}
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          '--gx': '50%',
          '--gy': '50%',
        } as React.CSSProperties}
      >
        <div
          className="absolute w-[80vw] h-[80vw] sm:w-[600px] sm:h-[600px] rounded-full opacity-[0.07] blur-[120px]"
          style={{
            background: 'var(--color-primary-500)',
            left: 'calc(var(--gx, 50%) - 40vw)',
            top: 'calc(var(--gy, 50%) - 40vw)',
            transition: 'none',
          }}
        />
        <div
          className="absolute w-[70vw] h-[70vw] sm:w-[500px] sm:h-[500px] rounded-full opacity-[0.05] blur-[100px]"
          style={{
            background: 'var(--color-secondary-500)',
            left: 'calc(var(--gx, 50%) - 20vw)',
            top: 'calc(var(--gy, 50%) + 10vw)',
            transition: 'none',
          }}
        />
        <div
          className="absolute w-[60vw] h-[60vw] sm:w-[400px] sm:h-[400px] rounded-full opacity-[0.04] blur-[80px]"
          style={{
            background: 'var(--color-accent-500)',
            left: 'calc(var(--gx, 50%) + 15vw)',
            top: 'calc(var(--gy, 50%) - 30vw)',
            transition: 'none',
          }}
        />
      </div>

      {/* Canvas particle background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 1 }}
        aria-hidden="true"
      />

      {/* Main content */}
      <Container className="relative z-10 text-center">
        <div className="flex flex-col items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10">
          {/* Large staggered name reveal */}
          <div ref={nameRef} className="select-none">
            <div
              className={cn(
                'hero-name-line block mb-2 md:mb-4',
                'text-4xl sm:text-6xl md:text-8xl lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem]',
                'font-heading font-bold leading-none',
                'text-[var(--text-primary)]'
              )}
            >
              FIDA
            </div>
            <div
              className={cn(
                'hero-name-line block',
                'text-4xl sm:text-6xl md:text-8xl lg:text-[8rem] xl:text-[10rem] 2xl:text-[12rem]',
                'font-heading font-bold leading-none',
                'text-gradient'
              )}
              style={{ backgroundSize: '200% 200%', backgroundPosition: '0% 50%' }}
            >
              HUSSAIN
            </div>
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            className={cn(
              'text-base sm:text-xl md:text-2xl lg:text-3xl',
              'font-body text-[var(--text-secondary)]',
              'max-w-2xl mx-auto px-2'
            )}
          >
            {personalInfo.tagline}
          </div>

          {/* CTA buttons */}
          <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 mt-4 sm:mt-6 md:mt-8 px-2">
            <Button variant="primary" size="lg" href="#projects">
              View My Work
            </Button>
            <Button variant="outline" size="lg" href="#contact">
              Get In Touch
            </Button>
          </div>
        </div>
      </Container>

      {/* Floating orbital particles (paths defined inline in MotionPath config) */}
      {[
        { size: 6, opacity: 0.6, color: 'var(--color-primary-500)' },
        { size: 4, opacity: 0.4, color: 'var(--color-primary-400)' },
        { size: 8, opacity: 0.5, color: 'var(--color-primary-500)' },
        { size: 3, opacity: 0.35, color: 'var(--color-primary-300)' },
        { size: 5, opacity: 0.45, color: 'var(--color-primary-400)' },
      ].map((dot, i) => (
        <div
          key={`orbit-dot-${i}`}
          ref={(el) => { orbitDotsRef.current[i] = el }}
          className="absolute rounded-full pointer-events-none z-[2]"
          style={{
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            opacity: dot.opacity,
            boxShadow: `0 0 ${dot.size * 2}px ${dot.color}`,
          }}
          aria-hidden="true"
        />
      ))}

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ScrollIndicator />
      </div>
    </section>
  )
}
