import { useEffect, useRef } from 'react'
import { gsap } from '@utils/gsap-register'
import { useIsMobile } from '@hooks/useMediaQuery'

const TRAIL_COUNT = 5

export function CustomCursor() {
  const isMobile = useIsMobile()
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const trailRefs = useRef<HTMLDivElement[]>([])
  const quickXRef = useRef<gsap.QuickToFunc[]>([])
  const quickYRef = useRef<gsap.QuickToFunc[]>([])
  const ringQuickX = useRef<gsap.QuickToFunc | null>(null)
  const ringQuickY = useRef<gsap.QuickToFunc | null>(null)

  useEffect(() => {
    if (isMobile) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // Set up quickTo for ring (outer)
    ringQuickX.current = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' })
    ringQuickY.current = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' })

    // Set up quickTo for dot (inner)
    const dotQX = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power2.out' })
    const dotQY = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power2.out' })

    // Set up quickTo for trail dots
    trailRefs.current.forEach((trail, i) => {
      const dur = 0.2 + i * 0.1
      quickXRef.current[i] = gsap.quickTo(trail, 'x', { duration: dur, ease: 'power2.out' })
      quickYRef.current[i] = gsap.quickTo(trail, 'y', { duration: dur, ease: 'power2.out' })
    })

    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX
      const my = e.clientY

      dotQX(mx - 3)
      dotQY(my - 3)
      ringQuickX.current!(mx - 20)
      ringQuickY.current!(my - 20)

      trailRefs.current.forEach((_, i) => {
        quickXRef.current[i](mx - 2)
        quickYRef.current[i](my - 2)
      })
    }

    // Context detection using event delegation
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const cursorTextEl = target.closest('[data-cursor-text]') as HTMLElement | null
      const cursorHideEl = target.closest('[data-cursor-hide]')
      const interactiveEl = target.closest('a, button, [data-cursor-hover]')

      if (cursorHideEl) {
        gsap.to(ring, { opacity: 0, duration: 0.2 })
        gsap.to(dot, { opacity: 0, duration: 0.2 })
        trailRefs.current.forEach(t => gsap.to(t, { opacity: 0, duration: 0.2 }))
        return
      }

      if (cursorTextEl) {
        const text = cursorTextEl.getAttribute('data-cursor-text') || ''
        if (textRef.current) {
          textRef.current.textContent = text
        }
        gsap.to(ring, {
          width: 80,
          height: 80,
          borderColor: 'rgba(255,255,255,0.3)',
          backgroundColor: 'rgba(255,255,255,0.08)',
          duration: 0.3,
          ease: 'power2.out',
        })
        // Temporarily offset ring position for larger size
        if (ringQuickX.current && ringQuickY.current) {
          const mx = e.clientX
          const my = e.clientY
          ringQuickX.current(mx - 40)
          ringQuickY.current(my - 40)
        }
        if (textRef.current) {
          gsap.to(textRef.current, { opacity: 1, duration: 0.2 })
        }
        return
      }

      if (interactiveEl) {
        gsap.to(ring, { scale: 1.5, duration: 0.3, ease: 'power2.out' })
        return
      }
    }

    const handleMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const left = target.closest('[data-cursor-text], [data-cursor-hide], a, button, [data-cursor-hover]')
      if (!left) return

      gsap.to(ring, {
        width: 40,
        height: 40,
        scale: 1,
        borderColor: 'rgba(255,255,255,1)',
        backgroundColor: 'transparent',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      })
      gsap.to(dot, { opacity: 1, duration: 0.2 })
      trailRefs.current.forEach(t => gsap.to(t, { opacity: 1, duration: 0.2 }))
      if (textRef.current) {
        gsap.to(textRef.current, { opacity: 0, duration: 0.15 })
      }

      // Re-center ring position for default size
      const mx = e.clientX
      const my = e.clientY
      if (ringQuickX.current && ringQuickY.current) {
        ringQuickX.current(mx - 20)
        ringQuickY.current(my - 20)
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseover', handleMouseOver)
    document.addEventListener('mouseout', handleMouseOut)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
      document.removeEventListener('mouseout', handleMouseOut)
    }
  }, [isMobile])

  if (isMobile) return null

  return (
    <>
      {/* Trail dots */}
      {Array.from({ length: TRAIL_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => { if (el) trailRefs.current[i] = el }}
          className="pointer-events-none fixed top-0 left-0 z-[59] rounded-full bg-white mix-blend-difference"
          style={{
            width: 4 - i * 0.5,
            height: 4 - i * 0.5,
            opacity: 0.6 - i * 0.1,
          }}
        />
      ))}
      {/* Outer ring */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-60 rounded-full border border-white mix-blend-difference flex items-center justify-center"
        style={{ width: 40, height: 40 }}
      >
        <span
          ref={textRef}
          className="text-[10px] font-medium text-white opacity-0 select-none whitespace-nowrap"
        />
      </div>
      {/* Inner dot */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-60 rounded-full bg-white mix-blend-difference"
        style={{ width: 6, height: 6 }}
      />
    </>
  )
}
