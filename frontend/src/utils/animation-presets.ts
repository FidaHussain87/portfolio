export const fadeUp = {
  y: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
} as const

export const fadeDown = {
  y: -60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
} as const

export const fadeLeft = {
  x: -60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
} as const

export const fadeRight = {
  x: 60,
  opacity: 0,
  duration: 0.8,
  ease: 'power3.out',
} as const

export const scaleIn = {
  scale: 0.8,
  opacity: 0,
  duration: 0.6,
  ease: 'back.out(1.7)',
} as const

export const revealUp = {
  yPercent: 100,
  duration: 0.8,
  ease: 'power3.out',
} as const

export const clipReveal = {
  clipPath: 'inset(100% 0% 0% 0%)',
  duration: 1,
  ease: 'power3.inOut',
} as const

export const staggerDefaults = {
  fast: { each: 0.03 },
  normal: { each: 0.05 },
  slow: { each: 0.08 },
  slower: { each: 0.12 },
} as const
