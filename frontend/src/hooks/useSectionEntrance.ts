import { useRef, useEffect } from 'react'
import { gsap } from '@utils/gsap-register'

export type EntranceVariant =
  | 'clipRevealUp'
  | 'clipRevealCircle'
  | 'scaleFromCenter'
  | 'slideFromSides'
  | 'fadeBlur'
  | 'staggerGrid'

interface UseSectionEntranceOptions {
  triggerStart?: string
  duration?: number
  childSelector?: string
}

export function useSectionEntrance<T extends HTMLElement = HTMLElement>(
  variant: EntranceVariant,
  options: UseSectionEntranceOptions = {}
) {
  const ref = useRef<T>(null)

  const {
    triggerStart = 'top 80%',
    duration = 1,
    childSelector,
  } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (prefersReduced) {
        gsap.from(el, {
          opacity: 0,
          duration: 0.5,
          scrollTrigger: {
            trigger: el,
            start: triggerStart,
            toggleActions: 'play none none none',
          },
        })
        return
      }

      switch (variant) {
        case 'clipRevealUp': {
          gsap.fromTo(el,
            { clipPath: 'inset(100% 0 0 0)' },
            {
              clipPath: 'inset(0% 0 0 0)',
              duration,
              ease: 'power3.inOut',
              scrollTrigger: {
                trigger: el,
                start: triggerStart,
                toggleActions: 'play none none none',
              },
            }
          )
          break
        }

        case 'clipRevealCircle': {
          gsap.fromTo(el,
            { clipPath: 'circle(0% at 50% 50%)' },
            {
              clipPath: 'circle(100% at 50% 50%)',
              duration: duration * 1.2,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: el,
                start: triggerStart,
                toggleActions: 'play none none none',
              },
            }
          )
          break
        }

        case 'scaleFromCenter': {
          gsap.from(el, {
            scale: 0.8,
            opacity: 0,
            duration,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              toggleActions: 'play none none none',
            },
          })

          if (childSelector) {
            const children = el.querySelectorAll(childSelector)
            if (children.length) {
              gsap.from(children, {
                scale: 0.85,
                opacity: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: 'power3.out',
                scrollTrigger: {
                  trigger: el,
                  start: triggerStart,
                  toggleActions: 'play none none none',
                },
              })
            }
          }
          break
        }

        case 'slideFromSides': {
          const children = el.children
          if (children.length >= 2) {
            gsap.from(children[0], {
              x: -100,
              opacity: 0,
              duration,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: el,
                start: triggerStart,
                toggleActions: 'play none none none',
              },
            })
            gsap.from(children[1], {
              x: 100,
              opacity: 0,
              duration,
              delay: 0.15,
              ease: 'expo.out',
              scrollTrigger: {
                trigger: el,
                start: triggerStart,
                toggleActions: 'play none none none',
              },
            })
          }
          break
        }

        case 'fadeBlur': {
          gsap.from(el, {
            filter: 'blur(20px)',
            opacity: 0,
            duration,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: el,
              start: triggerStart,
              toggleActions: 'play none none none',
            },
          })
          break
        }

        case 'staggerGrid': {
          const selector = childSelector || ':scope > *'
          const children = el.querySelectorAll(selector)
          if (children.length) {
            gsap.from(children, {
              opacity: 0,
              scale: 0.9,
              y: 30,
              duration: 0.6,
              stagger: {
                each: 0.06,
                from: 'edges',
              },
              ease: 'power3.out',
              scrollTrigger: {
                trigger: el,
                start: triggerStart,
                toggleActions: 'play none none none',
              },
            })
          }
          break
        }
      }
    }, el)

    return () => {
      ctx.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return ref
}
