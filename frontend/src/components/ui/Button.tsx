import { useRef, useCallback, useEffect, type ReactNode, type MouseEvent } from 'react'
import { cn } from '@utils/cn'
import { gsap } from '@utils/gsap-register'
import { useMagneticEffect } from '@hooks/useMagneticEffect'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  className?: string
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void
  href?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const sizeClasses = {
  sm: 'px-4 py-1.5 text-sm gap-1.5',
  md: 'px-6 py-2.5 text-base gap-2',
  lg: 'px-8 py-3.5 text-lg gap-2.5',
} as const

const variantClasses = {
  primary: [
    'bg-gradient-to-r from-primary-500 to-primary-400',
    'text-[var(--text-inverse)] font-semibold',
    'shadow-[0_0_0_rgba(0,229,219,0)]',
    'hover:shadow-[0_0_20px_rgba(0,229,219,0.4)]',
    'transition-shadow duration-300',
  ].join(' '),
  secondary: [
    'bg-gradient-to-r from-secondary-500 to-secondary-400',
    'text-white font-semibold',
    'transition-opacity duration-300',
    'hover:opacity-90',
  ].join(' '),
  ghost: [
    'bg-transparent',
    'text-[var(--text-primary)]',
    'hover:bg-[var(--glass-bg-medium)]',
    'transition-colors duration-300',
  ].join(' '),
  outline: [
    'bg-transparent',
    'border border-[var(--border-strong)]',
    'text-[var(--text-primary)]',
    'hover:border-primary-500 hover:text-primary-400',
    'transition-colors duration-300',
  ].join(' '),
} as const

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  onClick,
  href,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const rippleRef = useRef<HTMLSpanElement>(null)
  const magneticRef = useMagneticEffect<HTMLDivElement>({ strength: 0.2 })
  const borderRef = useRef<SVGRectElement>(null)
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)

  // SVG border draw on hover for outline variant
  useEffect(() => {
    if (variant !== 'outline' || !borderRef.current) return

    const rect = borderRef.current
    const len = rect.getTotalLength()
    gsap.set(rect, { strokeDasharray: len, strokeDashoffset: len })
  }, [variant])

  const handleHoverIn = useCallback(() => {
    if (variant === 'outline' && borderRef.current) {
      gsap.to(borderRef.current, {
        strokeDashoffset: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
    }
    if (variant === 'primary' && buttonRef.current) {
      gsap.to(buttonRef.current, {
        boxShadow: '0 0 25px rgba(0,229,219,0.5), 0 0 50px rgba(0,229,219,0.2)',
        duration: 0.3,
        ease: 'power2.out',
      })
    }
  }, [variant])

  const handleHoverOut = useCallback(() => {
    if (variant === 'outline' && borderRef.current) {
      const len = borderRef.current.getTotalLength()
      gsap.to(borderRef.current, {
        strokeDashoffset: len,
        duration: 0.3,
        ease: 'power2.in',
      })
    }
    if (variant === 'primary' && buttonRef.current) {
      gsap.to(buttonRef.current, {
        boxShadow: '0 0 0 rgba(0,229,219,0)',
        duration: 0.3,
        ease: 'power2.in',
      })
    }
  }, [variant])

  const handleRipple = useCallback(
    (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      const target = e.currentTarget
      const rect = target.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const ripple = document.createElement('span')
      ripple.style.position = 'absolute'
      ripple.style.left = `${x}px`
      ripple.style.top = `${y}px`
      ripple.style.width = '0px'
      ripple.style.height = '0px'
      ripple.style.borderRadius = '50%'
      ripple.style.background = 'rgba(255, 255, 255, 0.3)'
      ripple.style.transform = 'translate(-50%, -50%)'
      ripple.style.pointerEvents = 'none'

      target.appendChild(ripple)

      const size = Math.max(rect.width, rect.height) * 2

      gsap.to(ripple, {
        width: size,
        height: size,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: () => {
          ripple.remove()
        },
      })

      onClick?.(e)
    },
    [onClick]
  )

  const sharedClasses = cn(
    'relative inline-flex items-center justify-center',
    'rounded-lg font-body overflow-hidden',
    'select-none whitespace-nowrap',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500',
    sizeClasses[size],
    variantClasses[variant],
    disabled && 'opacity-50 pointer-events-none cursor-not-allowed',
    className
  )

  const outlineSvg = variant === 'outline' && (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none z-20 rounded-lg"
      preserveAspectRatio="none"
    >
      <rect
        ref={borderRef}
        x="0.5"
        y="0.5"
        rx="8"
        ry="8"
        fill="none"
        stroke="var(--color-primary-500)"
        strokeWidth="2"
        style={{ width: 'calc(100% - 1px)', height: 'calc(100% - 1px)' }}
      />
    </svg>
  )

  const content = (
    <>
      {outlineSvg}
      <span className="relative z-10 flex items-center gap-inherit">
        {children}
      </span>
      <span ref={rippleRef} aria-hidden="true" />
    </>
  )

  if (href) {
    return (
      <div ref={magneticRef} className="inline-block">
        <a
          ref={buttonRef as React.Ref<HTMLAnchorElement>}
          href={href}
          className={sharedClasses}
          onClick={handleRipple}
          onMouseEnter={handleHoverIn}
          onMouseLeave={handleHoverOut}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : undefined}
        >
          {content}
        </a>
      </div>
    )
  }

  return (
    <div ref={magneticRef} className="inline-block">
      <button
        ref={buttonRef as React.Ref<HTMLButtonElement>}
        type={type}
        className={sharedClasses}
        onClick={handleRipple}
        onMouseEnter={handleHoverIn}
        onMouseLeave={handleHoverOut}
        disabled={disabled}
      >
        {content}
      </button>
    </div>
  )
}
