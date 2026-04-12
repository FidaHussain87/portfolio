import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight
      const maxScroll = documentHeight - windowHeight

      if (maxScroll > 0) {
        setProgress(Math.min(scrollY / maxScroll, 1))
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed top-0 left-0 z-50 h-[2px] w-full origin-left"
      style={{
        background: `linear-gradient(90deg,
          var(--color-primary-500, #00e5db) 0%,
          var(--color-secondary-500, #7c3aed) 50%,
          var(--color-accent-500, #e50057) 100%)`,
        backgroundSize: '200% 100%',
        animation: 'gradient-flow 3s ease infinite',
        transform: `scaleX(${progress})`,
      }}
    >
      {/* Glow spot at leading edge */}
      <div
        className="absolute top-0 h-[4px] w-[40px] rounded-full pointer-events-none"
        style={{
          right: 0,
          background: 'var(--color-primary-400)',
          boxShadow: '0 0 12px 4px rgba(0,229,219,0.6), 0 0 24px 8px rgba(0,229,219,0.3)',
          opacity: progress > 0.01 ? 1 : 0,
          transform: 'translateY(-1px)',
        }}
      />
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  )
}
