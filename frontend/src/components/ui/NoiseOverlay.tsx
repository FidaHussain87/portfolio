import { cn } from '@utils/cn'

interface NoiseOverlayProps {
  className?: string
}

export function NoiseOverlay({ className }: NoiseOverlayProps) {
  return <div className={cn('noise-overlay', className)} />
}
