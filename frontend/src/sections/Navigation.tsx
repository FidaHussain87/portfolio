import { useRef, useState, useEffect, useCallback } from 'react'
import { Menu, X } from 'lucide-react'
import { gsap, ScrollTrigger } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { ThemeToggle } from '@components/ui'
import { navigation } from '@data/index'
import { useTheme } from '@design-system/theme'
import { usePrefersReducedMotion } from '@hooks/usePrefersReducedMotion'
import type { NavItem } from '@data/index'

interface NavigationProps {
  preloaderComplete: boolean
}

export function Navigation({ preloaderComplete }: NavigationProps) {
  const navRef = useRef<HTMLElement>(null)
  const pillContainerRef = useRef<HTMLDivElement>(null)
  const activeBackdropRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const mobileLinksRef = useRef<(HTMLAnchorElement | null)[]>([])
  const lastScrollY = useRef(0)
  const entrancePlayed = useRef(false)
  const scanlineRef = useRef<HTMLDivElement>(null)
  const logoGlitchRef = useRef<HTMLSpanElement>(null)
  const sectionTriggersRef = useRef<Map<string, ScrollTrigger>>(new Map())

  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  const { theme } = useTheme()
  const prefersReducedMotion = usePrefersReducedMotion()
  const isDark = theme === 'dark'

  // ── Active section tracking via ScrollTrigger ───────────────────────────
  useEffect(() => {
    const triggers: ScrollTrigger[] = []

    navigation.forEach((item: NavItem) => {
      const el = document.getElementById(item.sectionId)
      if (!el) return

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        end: 'bottom 20%',
        onToggle: (self) => {
          if (self.isActive) {
            setActiveSection(item.sectionId)
          }
        },
      })

      sectionTriggersRef.current.set(item.sectionId, trigger)
      triggers.push(trigger)
    })

    return () => {
      triggers.forEach((t) => t.kill())
      sectionTriggersRef.current.clear()
    }
  }, [])

  // ── Move the active pill backdrop to the current link ──────────────────
  const moveActiveBackdrop = useCallback(() => {
    const container = pillContainerRef.current
    const backdrop = activeBackdropRef.current
    const activeLink = linkRefs.current.get(activeSection)
    if (!container || !backdrop || !activeLink) return

    const containerRect = container.getBoundingClientRect()
    const linkRect = activeLink.getBoundingClientRect()

    // Energy burst glow on section change
    if (!prefersReducedMotion) {
      gsap.fromTo(
        backdrop,
        {
          boxShadow: isDark
            ? '0 0 30px rgba(0, 229, 219, 0.6), 0 0 60px rgba(98, 0, 229, 0.3)'
            : '0 0 20px rgba(0, 229, 219, 0.3), 0 0 40px rgba(98, 0, 229, 0.15)',
        },
        {
          boxShadow: isDark
            ? '0 0 16px rgba(0, 229, 219, 0.2), 0 0 4px rgba(0, 229, 219, 0.1)'
            : '0 0 10px rgba(0, 229, 219, 0.12), 0 0 3px rgba(0, 229, 219, 0.06)',
          duration: 0.8,
          ease: 'power2.out',
        },
      )
    }

    gsap.to(backdrop, {
      x: linkRect.left - containerRect.left,
      width: linkRect.width,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [activeSection, isDark, prefersReducedMotion])

  useEffect(() => {
    moveActiveBackdrop()
  }, [moveActiveBackdrop])

  useEffect(() => {
    const handleResize = () => moveActiveBackdrop()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [moveActiveBackdrop])

  // ── Scroll behaviour: glassmorphism + hide/show ─────────────────────────
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY

    setScrolled(currentY > 50)

    if (currentY > 100) {
      setHidden(currentY > lastScrollY.current && currentY - lastScrollY.current > 5)
    } else {
      setHidden(false)
    }

    lastScrollY.current = currentY
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // ── Scanline sweep animation (every ~8s) ────────────────────────────────
  useEffect(() => {
    if (prefersReducedMotion || !scanlineRef.current) return

    const ctx = gsap.context(() => {
      gsap.set(scanlineRef.current, { xPercent: -100, opacity: 0 })

      gsap.timeline({ repeat: -1, repeatDelay: 6 })
        .to(scanlineRef.current, {
          opacity: isDark ? 0.06 : 0.03,
          duration: 0.3,
          ease: 'power2.in',
        })
        .to(scanlineRef.current, {
          xPercent: 200,
          duration: 2,
          ease: 'power1.inOut',
        })
        .to(scanlineRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out',
        }, '-=0.3')
        .set(scanlineRef.current, { xPercent: -100 })
    }, navRef)

    return () => {
      ctx.revert()
    }
  }, [prefersReducedMotion, isDark])

  // ── Entrance animation — hologram boot-up ───────────────────────────────
  useEffect(() => {
    if (!preloaderComplete || entrancePlayed.current) return
    entrancePlayed.current = true

    const ctx = gsap.context(() => {
      const tl = gsap.timeline()

      // Stage 1: Nav slides down (faster)
      tl.fromTo(
        navRef.current,
        { yPercent: -100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: 'expo.out' },
      )

      // Stage 2: Hologram boot-up flicker (skip if reduced motion)
      if (!prefersReducedMotion) {
        tl.to(navRef.current, {
          keyframes: [
            { opacity: 0.3, duration: 0.05 },
            { opacity: 1, duration: 0.05 },
            { opacity: 0.4, duration: 0.06 },
            { opacity: 1, duration: 0.05 },
            { opacity: 0.5, duration: 0.04 },
            { opacity: 1, duration: 0.06 },
          ],
        }, '-=0.1')
      }

      // Stage 3: Pill container scales in horizontally from center with bounce
      if (pillContainerRef.current) {
        tl.fromTo(
          pillContainerRef.current,
          { scaleX: 0, scaleY: 0.85, opacity: 0 },
          { scaleX: 1, scaleY: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' },
          '-=0.2',
        )
      }

      // Stage 4: Logo pulse glow flash
      if (!prefersReducedMotion && logoGlitchRef.current) {
        tl.fromTo(
          logoGlitchRef.current,
          { textShadow: '0 0 20px rgba(0, 229, 219, 0.8), 0 0 40px rgba(0, 229, 219, 0.4)' },
          { textShadow: '0 0 0px rgba(0, 229, 219, 0)', duration: 0.8, ease: 'power2.out' },
          '-=0.3',
        )
      }
    }, navRef)

    return () => {
      ctx.revert()
    }
  }, [preloaderComplete, prefersReducedMotion])

  // ── Logo hover — chromatic aberration glow ──────────────────────────────
  const handleLogoEnter = useCallback(() => {
    if (prefersReducedMotion || !logoGlitchRef.current) return

    gsap.to(logoGlitchRef.current, {
      textShadow: isDark
        ? '0 0 10px rgba(0, 229, 219, 0.8), -2px 0 8px rgba(236, 72, 153, 0.5), 2px 0 8px rgba(98, 0, 229, 0.5)'
        : '0 0 8px rgba(0, 229, 219, 0.5), -1px 0 5px rgba(236, 72, 153, 0.3), 1px 0 5px rgba(98, 0, 229, 0.3)',
      duration: 0.3,
      ease: 'power2.out',
    })
  }, [prefersReducedMotion, isDark])

  const handleLogoLeave = useCallback(() => {
    if (prefersReducedMotion || !logoGlitchRef.current) return

    gsap.to(logoGlitchRef.current, {
      textShadow: '0 0 0px rgba(0, 229, 219, 0)',
      duration: 0.4,
      ease: 'power2.inOut',
    })
  }, [prefersReducedMotion])

  // ── Mobile menu animation ───────────────────────────────────────────────
  useEffect(() => {
    if (!mobileMenuRef.current) return

    const ctx = gsap.context(() => {
      if (mobileOpen) {
        document.body.style.overflow = 'hidden'

        gsap.fromTo(
          mobileMenuRef.current,
          { opacity: 0, pointerEvents: 'none' },
          { opacity: 1, pointerEvents: 'auto', duration: 0.3, ease: 'power2.out' },
        )

        const links = mobileLinksRef.current.filter(Boolean)
        if (links.length > 0) {
          gsap.fromTo(
            links,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.04,
              ease: 'power3.out',
              delay: 0.1,
            },
          )
        }
      } else {
        document.body.style.overflow = ''

        gsap.to(mobileMenuRef.current, {
          opacity: 0,
          pointerEvents: 'none',
          duration: 0.25,
          ease: 'power2.in',
        })
      }
    }, mobileMenuRef)

    return () => {
      ctx.revert()
    }
  }, [mobileOpen])

  useEffect(() => {
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  const handleNavClick = (href: string) => {
    setMobileOpen(false)
    const targetId = href.replace('#', '')

    // Immediately mark the clicked section as active
    setActiveSection(targetId)

    const el = document.getElementById(targetId)
    if (el) {
      const navHeight = navRef.current?.offsetHeight ?? 72
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight - 16
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    }
  }

  const setLinkRef = useCallback(
    (sectionId: string) => (el: HTMLAnchorElement | null) => {
      if (el) {
        linkRefs.current.set(sectionId, el)
      } else {
        linkRefs.current.delete(sectionId)
      }
    },
    [],
  )

  // ── ScrambleText on desktop nav link hover ────────────────────────────
  const handleLinkMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (prefersReducedMotion) return
      const linkEl = e.currentTarget
      gsap.to(linkEl, {
        duration: 0.4,
        scrambleText: {
          text: '{original}',
          chars: '01╱╲/',
          speed: 0.6,
        },
      })
    },
    [prefersReducedMotion],
  )

  // ── Theme-aware style values ────────────────────────────────────────────
  const glassBackground = scrolled
    ? {
        background: isDark ? 'rgba(10, 10, 15, 0.75)' : 'rgba(250, 251, 255, 0.85)',
        backdropFilter: 'blur(30px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.6)',
      }
    : { background: 'transparent' }

  const gradientBorderOpacity = isDark ? 0.4 : 0.2

  return (
    <>
      <nav
        ref={navRef}
        className={cn(
          'fixed top-0 left-0 z-[50] w-full transition-transform duration-300',
          !preloaderComplete && 'opacity-0',
          hidden && !mobileOpen ? '-translate-y-full' : 'translate-y-0',
        )}
      >
        {/* ── Layer 1: Base glass background ─────────────────────────────── */}
        <div
          className="absolute inset-0 transition-all duration-500"
          style={glassBackground}
        />

        {/* ── Layer 2: Animated gradient border (bottom edge) ────────────── */}
        {scrolled && (
          <div
            className="absolute bottom-0 left-0 right-0 h-[1px]"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(0, 229, 219, ${gradientBorderOpacity}), rgba(98, 0, 229, ${gradientBorderOpacity}), rgba(236, 72, 153, ${gradientBorderOpacity}), transparent)`,
              backgroundSize: '200% 100%',
              animation: prefersReducedMotion ? 'none' : 'holo-shimmer 4s linear infinite',
            }}
          />
        )}

        {/* ── Layer 3: Scanline sweep ────────────────────────────────────── */}
        <div
          ref={scanlineRef}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 229, 219, 0.15), transparent)',
            width: '30%',
            opacity: 0,
          }}
        />

        {/* ── Layer 4: Top highlight line ────────────────────────────────── */}
        {scrolled && (
          <div
            className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, ${isDark ? 0.06 : 0.1}), transparent)`,
            }}
          />
        )}

        <div className="relative mx-auto flex w-full max-w-7xl items-center justify-between gap-4 lg:gap-6 px-5 sm:px-8 lg:px-12 py-3 sm:py-4">
          {/* ── Logo — Cyber code style ──────────────────────────────────── */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick('#home')
            }}
            onMouseEnter={handleLogoEnter}
            onMouseLeave={handleLogoLeave}
            className="relative z-10 group flex items-center gap-1"
          >
            <span
              ref={logoGlitchRef}
              className="text-2xl font-heading font-bold tracking-tight sm:text-3xl"
            >
              <span className="text-[var(--text-tertiary)] font-mono text-lg sm:text-xl font-normal opacity-50">&lt;</span>
              <span className="text-[var(--color-primary-500)]">&nbsp;F</span>
              <span className="text-[var(--text-primary)]">H</span>
              <span className="text-[var(--text-tertiary)] font-mono text-lg sm:text-xl font-normal opacity-50">&nbsp;/&gt;</span>
            </span>
            {/* Diamond accent dot */}
            <span
              className={cn(
                'block h-1.5 w-1.5 bg-[var(--color-primary-500)]',
                'transition-all duration-300 group-hover:scale-[2] group-hover:shadow-[0_0_8px_rgba(0,229,219,0.6)]',
              )}
              style={{ transform: 'rotate(45deg)' }}
            />
          </a>

          {/* ── Desktop Nav Pill — Holographic border + numbered links ──── */}
          <div
            ref={pillContainerRef}
            className="relative hidden lg:flex items-center gap-0.5 rounded-full px-2 py-1.5"
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.03)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
              boxShadow: isDark
                ? '0 0 0 1px rgba(255, 255, 255, 0.02), 0 4px 24px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.04)'
                : '0 0 0 1px rgba(0, 0, 0, 0.02), 0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
            }}
          >
            {/* Holographic shimmer border overlay */}
            <div
              className="absolute inset-[-1px] rounded-full pointer-events-none"
              style={{
                padding: '1px',
                background: `linear-gradient(90deg, transparent, rgba(0, 229, 219, ${isDark ? 0.15 : 0.08}), rgba(98, 0, 229, ${isDark ? 0.15 : 0.08}), rgba(236, 72, 153, ${isDark ? 0.15 : 0.08}), transparent)`,
                backgroundSize: '200% 100%',
                animation: prefersReducedMotion ? 'none' : 'holo-shimmer 6s linear infinite',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'exclude',
                WebkitMaskComposite: 'xor',
              }}
            />

            {/* Active pill backdrop — gradient fill with pulsing glow */}
            <div
              ref={activeBackdropRef}
              className="absolute top-1.5 bottom-1.5 left-0 rounded-full pointer-events-none"
              style={{
                width: 0,
                opacity: 0,
                background: isDark
                  ? 'linear-gradient(135deg, rgba(0, 229, 219, 0.15), rgba(98, 0, 229, 0.1))'
                  : 'linear-gradient(135deg, rgba(0, 229, 219, 0.1), rgba(98, 0, 229, 0.06))',
                border: `1px solid ${isDark ? 'rgba(0, 229, 219, 0.25)' : 'rgba(0, 229, 219, 0.15)'}`,
                animation: prefersReducedMotion ? 'none' : 'pill-energy 3s ease-in-out infinite',
              }}
            />

            {navigation.map((item: NavItem, index: number) => {
              const isActive = activeSection === item.sectionId
              const num = String(index + 1).padStart(2, '0')
              return (
                <a
                  key={item.sectionId}
                  ref={setLinkRef(item.sectionId)}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                  }}
                  onMouseEnter={handleLinkMouseEnter}
                  className={cn(
                    'nav-link-futuristic',
                    'relative z-10 rounded-full',
                    'px-3 xl:px-4 py-1.5',
                    'text-xs xl:text-sm font-medium whitespace-nowrap',
                    'transition-colors duration-200',
                    isActive
                      ? 'text-[var(--color-primary-400)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]',
                  )}
                >
                  <span
                    className={cn(
                      'font-mono text-[10px] mr-1 tracking-tight',
                      isActive ? 'text-[var(--color-primary-500)]' : 'opacity-40',
                    )}
                  >
                    {num}.
                  </span>
                  {item.label}
                </a>
              )
            })}
          </div>

          {/* ── Right section ──────────────────────────────────────────────── */}
          <div className="relative z-10 flex items-center gap-3 flex-shrink-0">
            {/* Status indicator — hex badge, desktop only */}
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <span className="relative flex items-center justify-center" style={{ width: 12, height: 14 }}>
                {/* Expanding ring */}
                <span
                  className="absolute"
                  style={{
                    width: 12,
                    height: 14,
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: 'rgba(74, 222, 128, 0.3)',
                    animation: prefersReducedMotion ? 'none' : 'pulse-ring-expand 2s ease-out infinite',
                  }}
                />
                {/* Hex shape */}
                <span
                  className="relative"
                  style={{
                    width: 8,
                    height: 10,
                    display: 'block',
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    background: '#4ade80',
                  }}
                />
              </span>
              <span className="text-[11px] font-mono text-[var(--text-tertiary)] tracking-wider">
                <span className="opacity-40">{'// '}</span>online
              </span>
            </div>

            <ThemeToggle />

            {/* Hamburger — mobile only, glow border when open */}
            <button
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center rounded-xl lg:hidden',
                'text-[var(--text-primary)]',
                'transition-all duration-200',
                'cursor-pointer',
              )}
              style={{
                background: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                border: mobileOpen
                  ? '1px solid rgba(0, 229, 219, 0.4)'
                  : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)'}`,
                boxShadow: mobileOpen
                  ? '0 0 12px rgba(0, 229, 219, 0.2)'
                  : 'none',
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Full-Screen Overlay ─────────────────────────────────────── */}
      <div
        ref={mobileMenuRef}
        className={cn(
          'fixed inset-0 z-[45] flex flex-col items-center justify-center',
          'lg:hidden',
          'pointer-events-none opacity-0',
        )}
        style={{
          background: isDark ? 'rgba(10, 10, 15, 0.96)' : 'rgba(250, 251, 255, 0.96)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
        }}
      >
        {/* CSS Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Background decoration */}
        <div
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0, 229, 219, 0.06) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[250px] h-[250px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(98, 0, 229, 0.05) 0%, transparent 70%)' }}
        />

        <nav className="relative flex flex-col items-center gap-2">
          {navigation.map((item: NavItem, i: number) => {
            const isActive = activeSection === item.sectionId
            const num = String(i + 1).padStart(2, '0')
            return (
              <a
                key={item.sectionId}
                ref={(el) => {
                  mobileLinksRef.current[i] = el
                }}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleNavClick(item.href)
                }}
                className={cn(
                  'relative px-6 py-2.5 rounded-xl text-center',
                  'text-xl sm:text-2xl font-heading font-light tracking-wide',
                  'transition-all duration-200',
                  isActive
                    ? 'text-[var(--color-primary-400)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]',
                )}
              >
                <span
                  className={cn(
                    'font-mono text-sm mr-2 tracking-tight',
                    isActive ? 'text-[var(--color-primary-500)]' : 'opacity-30',
                  )}
                >
                  {num}
                </span>
                {item.label}
                {isActive && (
                  <span
                    className="absolute left-6 right-6 bottom-1 h-[2px] rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-secondary-500))',
                    }}
                  />
                )}
              </a>
            )
          })}
        </nav>

        {/* Bottom status — hex badge + code-style text */}
        <div className="absolute bottom-10 flex items-center gap-2">
          <span className="relative flex items-center justify-center" style={{ width: 12, height: 14 }}>
            <span
              className="absolute"
              style={{
                width: 12,
                height: 14,
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: 'rgba(74, 222, 128, 0.3)',
                animation: prefersReducedMotion ? 'none' : 'pulse-ring-expand 2s ease-out infinite',
              }}
            />
            <span
              className="relative"
              style={{
                width: 8,
                height: 10,
                display: 'block',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                background: '#4ade80',
              }}
            />
          </span>
          <span className="text-xs font-mono text-[var(--text-tertiary)] tracking-wider">
            <span className="opacity-40">{'// '}</span>available for work
          </span>
        </div>
      </div>
    </>
  )
}
