import type { ReactNode } from 'react'
import { cn } from '@utils/cn'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'accent'
  glow?: boolean
  className?: string
}

const variantClasses = {
  default: [
    'bg-[var(--glass-bg-medium)]',
    'text-[var(--text-secondary)]',
    'border-[var(--glass-border)]',
  ].join(' '),
  primary: [
    'bg-primary-500/10',
    'text-primary-400',
    'border-primary-500/20',
  ].join(' '),
  secondary: [
    'bg-secondary-500/10',
    'text-secondary-400',
    'border-secondary-500/20',
  ].join(' '),
  accent: [
    'bg-accent-500/10',
    'text-accent-400',
    'border-accent-500/20',
  ].join(' '),
} as const

const glowVariants = {
  default: 'shadow-[0_0_8px_rgba(179,185,204,0.15)]',
  primary: 'shadow-[0_0_8px_rgba(0,229,219,0.25)]',
  secondary: 'shadow-[0_0_8px_rgba(98,0,229,0.25)]',
  accent: 'shadow-[0_0_8px_rgba(229,0,87,0.25)]',
} as const

export function Badge({
  children,
  variant = 'default',
  glow = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center',
        'rounded-full border px-3 py-1',
        'text-xs font-medium leading-none',
        'select-none whitespace-nowrap',
        variantClasses[variant],
        glow && glowVariants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
