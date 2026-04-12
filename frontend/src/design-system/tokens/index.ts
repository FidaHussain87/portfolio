export { colors, themeColors } from './colors'
export type { ThemeMode } from './colors'
export { fontFamily, fontSize, fontWeight, lineHeight, letterSpacing } from './typography'
export { spacing } from './spacing'
export { shadows, glowShadows } from './shadows'
export { glassmorphism, blur, borderRadius } from './effects'
export { duration, easing, stagger, scrollTriggerDefaults } from './animation'

export const zIndex = {
  behind: -1,
  base: 0,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  popover: 50,
  cursor: 60,
  preloader: 100,
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const
