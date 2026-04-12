import { useRef, useEffect, useState } from 'react'
import { cn } from '@utils/cn'
import { gsap, ScrollTrigger } from '@utils/gsap-register'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export function AnimatedCounter({
  end,
  suffix = '',
  duration = 2,
  className,
}: AnimatedCounterProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [displayed, setDisplayed] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el || hasAnimated.current) return

    const counter = { value: 0 }

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
        if (hasAnimated.current) return
        hasAnimated.current = true

        gsap.to(counter, {
          value: end,
          duration,
          ease: 'power2.out',
          onUpdate: () => {
            setDisplayed(Math.round(counter.value))
          },
        })
      },
    })

    return () => {
      trigger.kill()
    }
  }, [end, duration])

  return (
    <span
      ref={containerRef}
      className={cn('tabular-nums', className)}
    >
      {displayed}
      {suffix}
    </span>
  )
}
