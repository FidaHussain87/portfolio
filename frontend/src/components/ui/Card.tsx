import { useRef, useCallback, forwardRef, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@utils/cn'
import { gsap } from '@utils/gsap-register'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    children,
    className,
    hover = false,
    glow = false,
  },
  forwardedRef
) {
  const internalRef = useRef<HTMLDivElement>(null)
  const cardRef = (forwardedRef as React.RefObject<HTMLDivElement | null>) ?? internalRef

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!hover || !cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2

      const rotateX = ((y - centerY) / centerY) * -8
      const rotateY = ((x - centerX) / centerX) * 8

      gsap.to(cardRef.current, {
        rotateX,
        rotateY,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800,
      })
    },
    [hover, cardRef]
  )

  const handleMouseLeave = useCallback(() => {
    if (!hover || !cardRef.current) return

    gsap.to(cardRef.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [hover, cardRef])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative rounded-2xl',
        'bg-[var(--glass-bg)] backdrop-blur-[10px]',
        'border border-[var(--glass-border)]',
        hover && 'will-change-transform',
        glow && 'glow-border',
        className
      )}
      style={hover ? { transformStyle: 'preserve-3d' } : undefined}
    >
      {children}
    </div>
  )
})
