import { type ElementType } from 'react'
import { cn } from '@utils/cn'
import { useTextReveal } from '@hooks/useTextReveal'

interface TextRevealProps {
  children: string
  as?: ElementType
  mode?: 'chars' | 'words' | 'lines'
  className?: string
  stagger?: number
  delay?: number
}

export function TextReveal({
  children,
  as: Component = 'p',
  mode = 'words',
  className,
  stagger,
  delay,
}: TextRevealProps) {
  const ref = useTextReveal<HTMLElement>({
    mode,
    stagger,
    delay,
  })

  return (
    <Component ref={ref} className={cn(className)}>
      {children}
    </Component>
  )
}
