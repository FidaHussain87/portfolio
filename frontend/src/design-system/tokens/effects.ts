export const glassmorphism = {
  light: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropBlur: '10px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  medium: {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropBlur: '20px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
  heavy: {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropBlur: '30px',
    border: '1px solid rgba(255, 255, 255, 0.18)',
  },
} as const

export const blur = {
  none: '0',
  sm: '4px',
  md: '8px',
  lg: '16px',
  xl: '24px',
  '2xl': '40px',
  '3xl': '64px',
} as const

export const borderRadius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
} as const
