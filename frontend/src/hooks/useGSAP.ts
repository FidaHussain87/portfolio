import { useRef, useEffect, useCallback } from 'react'
import { gsap } from '@utils/gsap-register'

export function useGSAP<T extends HTMLElement = HTMLDivElement>(
  callback: (ctx: gsap.Context) => void,
  deps: React.DependencyList = []
) {
  const containerRef = useRef<T>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedCallback = useCallback(callback, deps)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    ctxRef.current = gsap.context(() => {
      memoizedCallback(ctxRef.current!)
    }, container)

    return () => {
      ctxRef.current?.revert()
    }
  }, [memoizedCallback])

  return { containerRef, ctx: ctxRef }
}
