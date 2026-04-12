import { useRef } from 'react'
import { Sun, Moon } from 'lucide-react'
import { gsap } from '@utils/gsap-register'
import { useTheme } from '@design-system/theme'
import { cn } from '@utils/cn'

interface ThemeToggleProps {
  className?: string
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const iconRef = useRef<HTMLSpanElement>(null)

  const handleToggle = () => {
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: '+=360',
        duration: 0.5,
        ease: 'power2.inOut',
      })
    }
    toggleTheme()
  }

  return (
    <button
      onClick={handleToggle}
      aria-label="Toggle theme"
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-full',
        'border border-[var(--border-default)] bg-[var(--bg-elevated)]',
        'text-[var(--text-primary)] transition-colors hover:border-[var(--border-strong)]',
        'cursor-pointer',
        className,
      )}
    >
      <span ref={iconRef} className="flex items-center justify-center">
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </span>
    </button>
  )
}
