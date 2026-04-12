import { useRef, useEffect, useId } from 'react'
import { gsap } from '@utils/gsap-register'

interface SectionDividerProps {
  variant?: 'wave' | 'diagonal'
  flip?: boolean
}

export function SectionDivider({ variant = 'wave', flip = false }: SectionDividerProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const gradientId = useId()

  useEffect(() => {
    const svg = svgRef.current
    const path = pathRef.current
    if (!svg || !path) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const length = path.getTotalLength()

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: prefersReduced ? 0 : length,
    })

    if (prefersReduced) return

    const ctx = gsap.context(() => {
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: svg,
          start: 'top 90%',
          end: 'bottom 50%',
          scrub: 1,
        },
      })
    }, svg)

    return () => {
      ctx.revert()
    }
  }, [])

  const d = variant === 'wave'
    ? 'M 0,20 C 200,60 400,-10 600,25 C 800,60 1000,-5 1200,20'
    : flip
      ? 'M 0,40 L 1200,0'
      : 'M 0,0 L 1200,40'

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 40 }}>
      <svg
        ref={svgRef}
        viewBox="0 0 1200 40"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={flip ? { transform: 'scaleY(-1)' } : undefined}
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--color-secondary-500)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--color-accent-500)" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={d}
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          fill="none"
        />
      </svg>
    </div>
  )
}
