import type { ElementType, ReactNode, ComponentPropsWithoutRef } from 'react'
import { cn } from '@utils/cn'

type ContainerProps<T extends ElementType = 'div'> = {
  children: ReactNode
  className?: string
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, 'children' | 'className'>

export function Container<T extends ElementType = 'div'>({
  children,
  className,
  as,
  ...rest
}: ContainerProps<T>) {
  const Component = as || 'div'

  return (
    <Component
      className={cn('mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12', className)}
      {...rest}
    >
      {children}
    </Component>
  )
}
