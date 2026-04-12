import { useRef, useEffect } from 'react'
import { gsap, ScrollTrigger } from '@utils/gsap-register'

interface UseScrollTriggerOptions {
  trigger?: string | Element
  start?: string
  end?: string
  scrub?: boolean | number
  pin?: boolean | string
  toggleActions?: string
  markers?: boolean
  onEnter?: () => void
  onLeave?: () => void
  onEnterBack?: () => void
  onLeaveBack?: () => void
}

export function useScrollTrigger<T extends HTMLElement = HTMLDivElement>(
  animation: (el: T, tl: gsap.core.Timeline) => void,
  options: UseScrollTriggerOptions = {},
  deps: React.DependencyList = []
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: options.trigger ?? el,
          start: options.start ?? 'top 80%',
          end: options.end ?? 'bottom 20%',
          scrub: options.scrub,
          pin: options.pin,
          toggleActions: options.toggleActions ?? 'play none none none',
          markers: options.markers,
          onEnter: options.onEnter,
          onLeave: options.onLeave,
          onEnterBack: options.onEnterBack,
          onLeaveBack: options.onLeaveBack,
        },
      })

      animation(el, tl)
    }, el)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
