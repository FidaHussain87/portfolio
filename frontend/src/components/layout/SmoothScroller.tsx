import type { ReactNode } from 'react'
import { useSmoothScroll } from '@hooks/useSmoothScroll'

interface SmoothScrollerProps {
  children: ReactNode
}

export function SmoothScroller({ children }: SmoothScrollerProps) {
  useSmoothScroll()

  return <div>{children}</div>
}
