export const colors = {
  primary: {
    50: '#e6fffe',
    100: '#b3fffc',
    200: '#80fff9',
    300: '#4dfff7',
    400: '#1afff4',
    500: '#00e5db',
    600: '#00b8af',
    700: '#008a83',
    800: '#005c58',
    900: '#002e2c',
    DEFAULT: '#00e5db',
  },
  secondary: {
    50: '#f0e6ff',
    100: '#d1b3ff',
    200: '#b380ff',
    300: '#944dff',
    400: '#761aff',
    500: '#6200e5',
    600: '#4e00b8',
    700: '#3b008a',
    800: '#27005c',
    900: '#14002e',
    DEFAULT: '#7c3aed',
  },
  accent: {
    50: '#ffe6f0',
    100: '#ffb3d1',
    200: '#ff80b3',
    300: '#ff4d94',
    400: '#ff1a76',
    500: '#e50057',
    600: '#b80046',
    700: '#8a0034',
    800: '#5c0023',
    900: '#2e0011',
    DEFAULT: '#ff1a76',
  },
  neutral: {
    50: '#f0f1f5',
    100: '#d9dce6',
    200: '#b3b9cc',
    300: '#8d96b3',
    400: '#677399',
    500: '#4a5580',
    600: '#3a4366',
    700: '#2a314d',
    800: '#1a1f33',
    900: '#0d101a',
    950: '#0a0a0f',
  },
} as const

export const themeColors = {
  dark: {
    bg: {
      primary: colors.neutral[950],
      secondary: colors.neutral[900],
      tertiary: colors.neutral[800],
      elevated: 'rgba(26, 31, 51, 0.8)',
    },
    text: {
      primary: '#f0f1f5',
      secondary: '#b3b9cc',
      tertiary: '#8d96b3',
      inverse: colors.neutral[950],
    },
    border: {
      default: 'rgba(179, 185, 204, 0.1)',
      subtle: 'rgba(179, 185, 204, 0.05)',
      strong: 'rgba(179, 185, 204, 0.2)',
    },
  },
  light: {
    bg: {
      primary: '#fafbff',
      secondary: '#f0f1f5',
      tertiary: '#e4e6ef',
      elevated: 'rgba(255, 255, 255, 0.9)',
    },
    text: {
      primary: colors.neutral[900],
      secondary: colors.neutral[600],
      tertiary: colors.neutral[500],
      inverse: '#f0f1f5',
    },
    border: {
      default: 'rgba(13, 16, 26, 0.1)',
      subtle: 'rgba(13, 16, 26, 0.05)',
      strong: 'rgba(13, 16, 26, 0.2)',
    },
  },
} as const

export type ThemeMode = 'dark' | 'light'
