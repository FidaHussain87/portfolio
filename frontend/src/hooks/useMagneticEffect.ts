import { useRef, useEffect } from 'react'
import { gsap } from '@utils/gsap-register'

interface MagneticOptions {
  strength?: number
  ease?: string
  duration?: number
}

export function useMagneticEffect<T extends HTMLElement = HTMLDivElement>(
  options: MagneticOptions = {}
) {
  const ref = useRef<T>(null)
  const { strength = 0.3, ease = 'power3.out', duration = 0.4 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Skip on touch devices
    if (window.matchMedia('(hover: none)').matches) return

    // Use gsap.quickTo for performant per-frame updates
    const xTo = gsap.quickTo(el, 'x', { duration, ease })
    const yTo = gsap.quickTo(el, 'y', { duration, ease })

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = (e.clientX - centerX) * strength
      const deltaY = (e.clientY - centerY) * strength

      xTo(deltaX)
      yTo(deltaY)
    }

    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)

    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength, ease, duration])

  return ref
}
