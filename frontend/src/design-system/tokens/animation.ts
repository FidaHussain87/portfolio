export const duration = {
  instant: 0.1,
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  slower: 1.0,
  slowest: 1.5,
  cinematic: 2.0,
} as const

export const easing = {
  smooth: 'power2.out',
  smoothIn: 'power2.in',
  smoothInOut: 'power2.inOut',
  sharp: 'power3.out',
  sharpIn: 'power3.in',
  sharpInOut: 'power3.inOut',
  expo: 'expo.out',
  expoIn: 'expo.in',
  expoInOut: 'expo.inOut',
  bounce: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.3)',
  custom: 'cubic-bezier(0.16, 1, 0.3, 1)',
} as const

export const stagger = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.08,
  slower: 0.12,
  section: 0.15,
} as const

export const scrollTriggerDefaults = {
  start: 'top 80%',
  end: 'bottom 20%',
  toggleActions: 'play none none none',
} as const
