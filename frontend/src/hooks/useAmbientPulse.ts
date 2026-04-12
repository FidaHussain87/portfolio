import { useEffect, type RefObject } from 'react'
import { gsap } from '@utils/gsap-register'

interface UseAmbientPulseOptions {
  selector: string
  property?: string
  from?: string | number
  to?: string | number
  duration?: number
  stagger?: number | gsap.StaggerVars
  ease?: string
}

export function useAmbientPulse<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  options: UseAmbientPulseOptions
) {
  const {
    selector,
    property = 'opacity',
    from = 0.7,
    to = 1,
    duration = 2,
    stagger = 0.1,
    ease = 'sine.inOut',
  } = options

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const elements = container.querySelectorAll<HTMLElement>(selector)
    if (elements.length === 0) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        elements,
        { [property]: from },
        {
          [property]: to,
          duration,
          stagger,
          ease,
          repeat: -1,
          yoyo: true,
        }
      )
    }, container)

    return () => {
      ctx.revert()
    }
  }, [containerRef, selector, property, from, to, duration, stagger, ease])
}
