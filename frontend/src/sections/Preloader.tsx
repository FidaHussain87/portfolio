import { useRef, useEffect } from 'react'
import { gsap } from '@utils/gsap-register'
import { cn } from '@utils/cn'

interface PreloaderProps {
  onComplete: () => void
}

export function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const fPathRef = useRef<SVGPathElement>(null)
  const hPathRef = useRef<SVGPathElement>(null)
  const nameRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          onComplete()
        },
      })

      // ── SVG DrawSVG reveal + MorphSVG effect ──────────────────────────
      const fPath = fPathRef.current
      const hPath = hPathRef.current

      if (fPath && hPath) {
        // Store original F path for morphing back
        const originalFPathD = fPath.getAttribute('d') || ''

        gsap.set(fPath, { drawSVG: '0%', opacity: 1 })
        gsap.set(hPath, { drawSVG: '0%', opacity: 1 })

        tl.to(fPath, {
          drawSVG: '100%',
          duration: 0.8,
          ease: 'power2.inOut',
        })
        tl.to(
          hPath,
          {
            drawSVG: '100%',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          '-=0.5',
        )

        // Fill in after stroke completes
        tl.to([fPath, hPath], {
          fill: 'var(--color-primary-500)',
          duration: 0.4,
          ease: 'power1.inOut',
        })

        // MorphSVG: F path morphs into a circle, then morphs back
        tl.to(fPath, {
          morphSVG: { shape: 'M 47,15 A 30,30 0 1 1 47,85 A 30,30 0 1 1 47,15 Z' },
          duration: 0.5,
          ease: 'power2.inOut',
        })
        tl.to(fPath, {
          morphSVG: originalFPathD,
          duration: 0.5,
          ease: 'power2.inOut',
        })
      }

      // ── Name letter-by-letter reveal ──────────────────────────────────
      if (nameRef.current) {
        const letters = nameRef.current.querySelectorAll('.preloader-letter')

        gsap.set(letters, { opacity: 0, y: 20 })

        tl.to(letters, {
          opacity: 1,
          y: 0,
          duration: 0.03,
          stagger: 0.04,
          ease: 'power2.out',
        })

        // ScrambleText "data decoding" effect on the name container
        tl.to(nameRef.current, {
          duration: 0.8,
          scrambleText: {
            text: '{original}',
            chars: '█▓▒░╱╲01',
            speed: 0.5,
            revealDelay: 0.2,
          },
        })
      }

      // ── Loading bar + counter ───────────────────────────────────────
      const counterObj = { value: 0 }
      if (barRef.current) {
        tl.to(
          barRef.current,
          {
            scaleX: 1,
            duration: 0.8,
            ease: 'power2.inOut',
          },
          '-=0.2',
        )
      }

      // Counter animation synced with bar
      if (counterRef.current) {
        tl.to(
          counterObj,
          {
            value: 100,
            duration: 0.8,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (counterRef.current) {
                counterRef.current.textContent = `${Math.round(counterObj.value)}%`
              }
            },
          },
          '<', // sync with bar
        )
      }

      // ── Hold briefly then circle reveal away ────────────────────────
      tl.to({}, { duration: 0.3 })

      if (overlayRef.current) {
        tl.to(overlayRef.current, {
          clipPath: 'circle(150% at 50% 50%)',
          duration: 1,
          ease: 'power3.inOut',
        })
      }
    }, overlayRef)

    return () => {
      ctx.revert()
    }
  }, [onComplete])

  const fullName = 'FIDA HUSSAIN'

  return (
    <div
      ref={overlayRef}
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center',
        'bg-[var(--bg-primary)]',
      )}
      style={{ clipPath: 'circle(100% at 50% 50%)' }}
    >
      {/* SVG Monogram */}
      <svg
        viewBox="0 0 200 100"
        className="mb-8 h-24 w-48 sm:h-32 sm:w-64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Letter F — geometric block letter */}
        <path
          ref={fPathRef}
          d="M 20,85 L 20,15 L 75,15 L 75,28 L 38,28 L 38,45 L 68,45 L 68,58 L 38,58 L 38,85 Z"
          stroke="var(--color-primary-500)"
          strokeWidth="2"
          fill="transparent"
          opacity="0"
        />
        {/* Letter H — geometric block letter */}
        <path
          ref={hPathRef}
          d="M 110,85 L 110,15 L 128,15 L 128,43 L 162,43 L 162,15 L 180,15 L 180,85 L 162,85 L 162,58 L 128,58 L 128,85 Z"
          stroke="var(--color-primary-500)"
          strokeWidth="2"
          fill="transparent"
          opacity="0"
        />
      </svg>

      {/* Full Name — letter by letter */}
      <div
        ref={nameRef}
        className="mb-6 flex gap-[0.15em] text-xl font-light tracking-[0.35em] text-[var(--text-primary)] sm:text-2xl"
        aria-label={fullName}
      >
        {fullName.split('').map((char, i) => (
          <span
            key={i}
            className="preloader-letter inline-block"
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </div>

      {/* Counter */}
      <span
        ref={counterRef}
        className="mb-4 text-sm font-mono text-[var(--text-tertiary)]"
      >
        0%
      </span>

      {/* Loading Bar */}
      <div className="h-[2px] w-48 overflow-hidden rounded-full bg-[var(--border-default)] sm:w-64">
        <div
          ref={barRef}
          className="h-full w-full origin-left scale-x-0 rounded-full bg-[var(--color-primary-500)]"
        />
      </div>
    </div>
  )
}
