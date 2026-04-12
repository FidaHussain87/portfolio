import { useRef, useEffect, type ReactNode } from 'react'
import { gsap } from '@utils/gsap-register'
import { cn } from '@utils/cn'

interface ScrollTextProps {
  children: ReactNode
  className?: string
}

export function ScrollText({ children, className }: ScrollTextProps) {
  const containerRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const text = el.textContent || ''
    el.innerHTML = ''
    el.setAttribute('aria-label', text)

    const words = text.split(' ')
    const spans: HTMLSpanElement[] = []

    words.forEach((word, idx) => {
      const span = document.createElement('span')
      span.textContent = word
      span.style.display = 'inline'
      span.style.opacity = '0.15'
      span.style.transition = 'none'
      span.className = 'scroll-word'
      span.setAttribute('aria-hidden', 'true')
      el.appendChild(span)

      if (idx < words.length - 1) {
        const space = document.createTextNode(' ')
        el.appendChild(space)
      }

      spans.push(span)
    })

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      spans.forEach(s => { s.style.opacity = '1' })
      return
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          end: 'bottom 60%',
          scrub: 1,
        },
      })

      tl.to(spans, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: 'none',
      })
    }, el)

    return () => {
      ctx.revert()
    }
  }, [children])

  return (
    <p
      ref={containerRef}
      className={cn('text-[var(--text-secondary)] leading-relaxed', className)}
    >
      {children}
    </p>
  )
}
