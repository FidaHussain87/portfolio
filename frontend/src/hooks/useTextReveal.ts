import { useRef, useEffect } from 'react'
import { gsap, SplitText } from '@utils/gsap-register'

type SplitMode = 'chars' | 'words' | 'lines'

interface UseTextRevealOptions {
  mode?: SplitMode
  stagger?: number
  duration?: number
  ease?: string
  y?: number
  delay?: number
  scrollTrigger?: boolean
  triggerStart?: string
  blur?: number
  rotateX?: number
  scale?: number
  fromDirection?: 'bottom' | 'top' | 'left' | 'right'
}

export function useTextReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseTextRevealOptions = {}
) {
  const ref = useRef<T>(null)
  const hasRun = useRef(false)
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null)

  const {
    mode = 'words',
    stagger = 0.05,
    duration = 0.8,
    ease = 'power3.out',
    y = 40,
    delay = 0,
    scrollTrigger = true,
    triggerStart = 'top 85%',
    blur = 0,
    rotateX = 0,
    scale: scaleVal,
    fromDirection = 'bottom',
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el || hasRun.current) return

    hasRun.current = true
    let cancelled = false
    let ctx: gsap.Context | null = null

    document.fonts.ready.then(() => {
      if (cancelled || !el) return

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      // Use SplitText plugin instead of manual DOM manipulation
      const splitInstance = new SplitText(el, { type: mode })
      splitRef.current = splitInstance

      // Get the split elements based on mode
      const elements =
        mode === 'chars'
          ? splitInstance.chars
          : mode === 'words'
            ? splitInstance.words
            : splitInstance.lines

      if (prefersReduced) return

      ctx = gsap.context(() => {
        // Compute directional offsets
        let xOffset = 0
        let yOffset = y
        if (fromDirection === 'top') yOffset = -Math.abs(y)
        else if (fromDirection === 'left') { xOffset = -Math.abs(y); yOffset = 0 }
        else if (fromDirection === 'right') { xOffset = Math.abs(y); yOffset = 0 }

        const animConfig: gsap.TweenVars = {
          y: yOffset,
          x: xOffset,
          opacity: 0,
          duration,
          ease,
          stagger,
          delay,
        }

        // Add enhanced options
        if (blur > 0) {
          animConfig.filter = `blur(${blur}px)`
        }
        if (rotateX !== 0) {
          animConfig.rotateX = rotateX
          animConfig.transformPerspective = 800
        }
        if (scaleVal !== undefined) {
          animConfig.scale = scaleVal
        }

        if (scrollTrigger) {
          gsap.from(elements, {
            ...animConfig,
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              toggleActions: 'play none none none',
            },
          })
        } else {
          gsap.from(elements, animConfig)
        }
      }, el)
    })

    return () => {
      cancelled = true
      ctx?.revert()
      splitRef.current?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
