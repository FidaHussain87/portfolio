import { useEffect, type RefObject } from 'react'
import { gsap } from '@utils/gsap-register'

interface UseHoverGlowOptions {
  selector: string
  y?: number
  scale?: number
  glowColor?: string
  glowSpread?: number
  duration?: number
  ease?: string
}

export function useHoverGlow<T extends HTMLElement>(
  containerRef: RefObject<T | null>,
  options: UseHoverGlowOptions
) {
  const {
    selector,
    y = -10,
    scale = 1.02,
    glowColor = 'rgba(0,229,219,0.12)',
    glowSpread = 30,
    duration = 0.35,
    ease = 'power2.out',
  } = options

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    const elements = container.querySelectorAll<HTMLElement>(selector)
    if (elements.length === 0) return

    const handlers: Array<{
      el: HTMLElement
      enter: (e: MouseEvent) => void
      leave: (e: MouseEvent) => void
    }> = []

    elements.forEach((el) => {
      const enter = () => {
        gsap.to(el, {
          y,
          scale,
          boxShadow: `0 0 ${glowSpread}px ${glowColor}`,
          duration,
          ease,
        })
      }

      const leave = () => {
        gsap.to(el, {
          y: 0,
          scale: 1,
          boxShadow: '0 0 0px rgba(0,0,0,0)',
          duration: duration * 1.2,
          ease: 'power3.out',
        })
      }

      el.addEventListener('mouseenter', enter)
      el.addEventListener('mouseleave', leave)
      handlers.push({ el, enter, leave })
    })

    return () => {
      handlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener('mouseenter', enter)
        el.removeEventListener('mouseleave', leave)
        gsap.killTweensOf(el)
      })
    }
  }, [containerRef, selector, y, scale, glowColor, glowSpread, duration, ease])
}
