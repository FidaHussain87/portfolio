import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react'
import type { ThemeMode } from '../tokens/colors'

interface ThemeContextValue {
  theme: ThemeMode
  toggleTheme: () => void
  setTheme: (theme: ThemeMode) => void
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)

const STORAGE_KEY = 'portfolio-theme'

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  // Auto-detect system preference when no manual override is stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme)

  const setTheme = useCallback((newTheme: ThemeMode) => {
    setThemeState(newTheme)
    localStorage.setItem(STORAGE_KEY, newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [theme, setTheme])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  // Listen for system color-scheme changes when no manual override is stored
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        const newTheme: ThemeMode = e.matches ? 'dark' : 'light'
        setThemeState(newTheme)
        document.documentElement.setAttribute('data-theme', newTheme)
      }
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
