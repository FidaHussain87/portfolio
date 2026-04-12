import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { gsap } from '@utils/gsap-register'

export function useSmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP's ticker
    const onRaf = (time: number) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(onRaf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onRaf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return lenisRef
}
