import { useRef, useEffect, useCallback, useState } from 'react'
import { cn } from '@utils/cn'
import { gsap } from '@utils/gsap-register'
import { Container } from '@components/layout'
import { MagneticWrapper } from '@components/ui'
import { personalInfo, navigation } from '@data/index'
import { ChevronUp } from 'lucide-react'

// ─── Inline SVG Brand Icons ─────────────────────────────────────────────────

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function TwitterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

// ─── Social Icon Map ─────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{ size?: number }>

const SOCIAL_ICON_MAP: Record<string, IconComponent> = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Twitter: TwitterIcon,
}

// ─── Scroll To Top Button ────────────────────────────────────────────────────

function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleScroll() {
      const shouldShow = window.scrollY > 400
      setVisible(shouldShow)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const el = buttonRef.current
    if (!el) return

    if (visible) {
      gsap.to(el, {
        opacity: 1,
        scale: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out',
      })
    } else {
      gsap.to(el, {
        opacity: 0,
        scale: 0.8,
        pointerEvents: 'none',
        duration: 0.2,
        ease: 'power2.in',
      })
    }
  }, [visible])

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <div
      ref={buttonRef}
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50"
      style={{ opacity: 0, pointerEvents: 'none' }}
    >
      <MagneticWrapper strength={0.4}>
        <button
          onClick={handleClick}
          aria-label="Scroll to top"
          className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            'bg-gradient-to-r from-primary-500 to-primary-400',
            'text-[var(--text-inverse)]',
            'shadow-[0_0_20px_rgba(0,229,219,0.3)]',
            'hover:shadow-[0_0_30px_rgba(0,229,219,0.5)]',
            'transition-shadow duration-300',
            'cursor-pointer'
          )}
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </MagneticWrapper>
    </div>
  )
}

// ─── Footer Section ──────────────────────────────────────────────────────────

export function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll('.footer-animate'), {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.08,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      })
    }, el)

    return () => {
      ctx.revert()
    }
  }, [])

  const socialLinks = personalInfo.socialLinks.filter(
    (link: { platform: string; url: string; handle: string }) => SOCIAL_ICON_MAP[link.platform] && link.platform !== 'Email'
  )

  return (
    <footer
      ref={footerRef}
      className="relative bg-[var(--bg-secondary)]"
    >
      {/* Top gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />

      <Container className="py-10 sm:py-14 lg:py-20">
        {/* Main content row */}
        <div className="footer-animate grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 items-start mb-8 sm:mb-12">
          {/* Left: logo + tagline */}
          <div className="flex flex-col gap-3">
            <span
              className={cn(
                'font-heading text-3xl font-bold',
                'text-gradient inline-block'
              )}
            >
              FH
            </span>
            <p className="text-sm leading-relaxed text-[var(--text-tertiary)] max-w-sm">
              {personalInfo.shortBio}
            </p>
          </div>

          {/* Center: quick nav links */}
          <nav
            className="footer-animate flex flex-wrap justify-center gap-x-8 gap-y-4"
            aria-label="Footer navigation"
          >
            {navigation.map((item) => (
              <a
                key={item.sectionId}
                href={item.href}
                className={cn(
                  'text-sm font-medium text-[var(--text-secondary)]',
                  'hover:text-primary-400 transition-colors duration-300'
                )}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right: social media icons */}
          <div className="footer-animate flex items-center gap-3 md:justify-end">
            {socialLinks.map((link: { platform: string; url: string; handle: string }) => {
              const Icon = SOCIAL_ICON_MAP[link.platform]
              if (!Icon) return null

              return (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className={cn(
                    'w-11 h-11 rounded-lg flex items-center justify-center',
                    'bg-[var(--glass-bg)] border border-[var(--glass-border)]',
                    'text-[var(--text-secondary)]',
                    'hover:text-primary-400 hover:border-primary-500/30',
                    'transition-colors duration-300'
                  )}
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="footer-animate h-px bg-[var(--border-default)] mb-8" />

        {/* Bottom row */}
        <div className="footer-animate flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--text-tertiary)]">
          <p>&copy; {new Date().getFullYear()} Fida Hussain. All rights reserved.</p>
        </div>
      </Container>

      {/* Scroll to top button */}
      <ScrollToTopButton />
    </footer>
  )
}
