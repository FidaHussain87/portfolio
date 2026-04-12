import type { CSSProperties } from 'react'
import { cn } from '@utils/cn'

interface GlowOrbProps {
  color?: 'primary' | 'secondary' | 'accent'
  size?: number
  className?: string
  style?: CSSProperties
}

const colorMap = {
  primary: 'var(--color-primary-500, #00e5db)',
  secondary: 'var(--color-secondary-500, #7c3aed)',
  accent: 'var(--color-accent-500, #ff1a76)',
} as const

export function GlowOrb({
  color = 'primary',
  size = 300,
  className,
  style,
}: GlowOrbProps) {
  const gradientColor = colorMap[color]

  return (
    <div
      className={cn(
        'pointer-events-none absolute rounded-full opacity-20 blur-3xl animate-float',
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${gradientColor} 0%, transparent 70%)`,
        ...style,
      }}
    />
  )
}
