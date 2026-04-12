import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '@utils/gsap-register'

const SECTION_IDS = ['home', 'about', 'skills', 'experience', 'projects', 'services', 'testimonials', 'github', 'contact']

export function useSnapScroll() {
  useEffect(() => {
    // Only enable snap on desktop
    const mm = gsap.matchMedia()

    mm.add('(min-width: 1024px)', () => {
      const sections = SECTION_IDS
        .map(id => document.getElementById(id))
        .filter(Boolean) as HTMLElement[]

      if (sections.length === 0) return

      ScrollTrigger.create({
        snap: {
          snapTo: 1 / (sections.length - 1),
          duration: { min: 0.2, max: 0.8 },
          delay: 0.1,
          ease: 'power2.inOut',
        },
      })
    })

    return () => {
      mm.revert()
    }
  }, [])
}
