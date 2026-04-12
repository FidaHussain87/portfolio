import { useRef, useEffect, type ReactNode } from 'react'
import { cn } from '@utils/cn'
import { gsap } from '@utils/gsap-register'

interface ParallaxLayerProps {
  children: ReactNode
  speed?: number
  className?: string
}

export function ParallaxLayer({
  children,
  speed = 0.5,
  className,
}: ParallaxLayerProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const distance = speed * 100

    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: distance,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, el)

    return () => {
      ctx.revert()
    }
  }, [speed])

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  )
}
