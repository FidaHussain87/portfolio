import { cn } from '@utils/cn'

type ShapeVariant = 'triangle' | 'hexagon' | 'circle' | 'cross'

interface GeometricShapeProps {
  variant: ShapeVariant
  size?: number
  color?: string
  className?: string
  rotate?: number
  strokeWidth?: number
}

function getShapePath(variant: ShapeVariant): string {
  switch (variant) {
    case 'triangle':
      return 'M12 2 L22 20 L2 20 Z'
    case 'hexagon':
      return 'M12 2 L21.66 7 L21.66 17 L12 22 L2.34 17 L2.34 7 Z'
    case 'circle':
      return 'M12 3 A9 9 0 1 0 12 21 A9 9 0 1 0 12 3'
    case 'cross':
      return 'M12 2 V22 M2 12 H22'
  }
}

export function GeometricShape({
  variant,
  size = 40,
  color = 'currentColor',
  className,
  rotate = 0,
  strokeWidth = 1.5,
}: GeometricShapeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('pointer-events-none absolute', className)}
      style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
    >
      <path d={getShapePath(variant)} />
    </svg>
  )
}
