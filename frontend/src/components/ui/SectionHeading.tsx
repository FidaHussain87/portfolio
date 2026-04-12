import { useRef, useEffect } from 'react'
import { cn } from '@utils/cn'
import { gsap, SplitText } from '@utils/gsap-register'

interface SectionHeadingProps {
  label: string
  title: string
  align?: 'left' | 'center'
}

export function SectionHeading({
  label,
  title,
  align = 'center',
}: SectionHeadingProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const splitRef = useRef<InstanceType<typeof SplitText> | null>(null)

  useEffect(() => {
    const container = containerRef.current
    const labelEl = labelRef.current
    const titleEl = titleRef.current
    const lineEl = lineRef.current

    if (!container || !labelEl || !titleEl || !lineEl) return

    let cancelled = false
    let ctx: gsap.Context | null = null

    document.fonts.ready.then(() => {
      if (cancelled) return

      // Use SplitText plugin instead of manual word splitting
      const split = new SplitText(titleEl, {
        type: 'words',
        wordsClass: 'title-word inline-block',
      })
      splitRef.current = split

      ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        })

        // Label fades up
        tl.from(labelEl, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
        })

        // ScrambleText effect on label after fade-up
        tl.to(labelEl, {
          duration: 0.8,
          scrambleText: {
            text: '{original}',
            chars: '█▓▒░╱╲{}[]01',
            speed: 0.5,
            revealDelay: 0.2,
          },
        }, '-=0.3')

        // Title words reveal using SplitText words array
        tl.from(
          split.words,
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.5'
        )

        // Line grows from center
        tl.from(
          lineEl,
          {
            scaleX: 0,
            duration: 0.8,
            ease: 'power3.out',
          },
          '-=0.4'
        )

        // Animate gradient flow on the line
        gsap.to(lineEl, {
          backgroundPosition: '200% 50%',
          duration: 3,
          ease: 'none',
          repeat: -1,
          yoyo: true,
        })
      }, container)
    })

    return () => {
      cancelled = true
      ctx?.revert()
      splitRef.current?.revert()
    }
  }, [title])

  return (
    <div
      ref={containerRef}
      className={cn(
        'mb-8 sm:mb-12 lg:mb-16',
        align === 'center' && 'text-center',
        align === 'left' && 'text-left'
      )}
    >
      <span
        ref={labelRef}
        className={cn(
          'inline-block mb-3',
          'text-xs font-semibold uppercase tracking-widest',
          'text-primary-400'
        )}
      >
        {label}
      </span>

      <h2
        ref={titleRef}
        className={cn(
          'font-heading text-3xl sm:text-4xl lg:text-6xl font-bold',
          'text-[var(--text-primary)]',
          'leading-tight'
        )}
      >
        {title}
      </h2>

      <div
        className={cn(
          'mt-4',
          align === 'center' && 'flex justify-center'
        )}
      >
        <div
          ref={lineRef}
          className={cn(
            'h-1 w-20 rounded-full origin-center',
            'bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500'
          )}
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>
    </div>
  )
}
