import type { ReactNode } from 'react'
import { cn } from '@utils/cn'
import { useMagneticEffect } from '@hooks/useMagneticEffect'

interface MagneticWrapperProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function MagneticWrapper({
  children,
  strength = 0.3,
  className,
}: MagneticWrapperProps) {
  const ref = useMagneticEffect<HTMLDivElement>({ strength })

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
