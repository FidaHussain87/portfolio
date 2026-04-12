import { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { gsap } from '@utils/gsap-register'
import { cn } from '@utils/cn'

interface RadarCategory {
  label: string
  value: number // 0-100
}

interface SkillRadarProps {
  categories: RadarCategory[]
  className?: string
}

// ─── Geometry helpers ────────────────────────────────────────────────────────

const PAD = 60
const INNER = 400
const SIZE = INNER + PAD * 2
const CX = SIZE / 2
const CY = SIZE / 2
const RADIUS = 150
const LEVELS = [0.25, 0.5, 0.75, 1.0]
const LEVEL_LABELS = ['25', '50', '75', '100']

function polarToXY(angle: number, r: number) {
  return {
    x: CX + Math.cos(angle) * r,
    y: CY + Math.sin(angle) * r,
  }
}

function buildPolygonPoints(
  n: number,
  radiusFn: (i: number) => number
): string {
  const angleStep = (Math.PI * 2) / n
  return Array.from({ length: n }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2
    const { x, y } = polarToXY(angle, radiusFn(i))
    return `${x},${y}`
  }).join(' ')
}

/** Build SVG path string for the data polygon (needed for particles) */
function buildPolygonPath(
  n: number,
  radiusFn: (i: number) => number
): string {
  const angleStep = (Math.PI * 2) / n
  const pts = Array.from({ length: n }, (_, i) => {
    const angle = i * angleStep - Math.PI / 2
    return polarToXY(angle, radiusFn(i))
  })
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ') + ' Z'
}

// ─── Component ───────────────────────────────────────────────────────────────

export function SkillRadar({ categories, className }: SkillRadarProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const gridLinesRef = useRef<(SVGPolygonElement | null)[]>([])
  const axisLinesRef = useRef<(SVGLineElement | null)[]>([])
  const dataPolygonRef = useRef<SVGPolygonElement>(null)
  const dataStrokeRef = useRef<SVGPolygonElement>(null)
  const ghostPolygonRef = useRef<SVGPolygonElement>(null)
  const vertexDotsRef = useRef<(SVGGElement | null)[]>([])
  const labelsRef = useRef<(SVGGElement | null)[]>([])
  const valueTextsRef = useRef<(SVGTextElement | null)[]>([])
  const scanLineRef = useRef<SVGLineElement>(null)
  const glowFilterRef = useRef<SVGFEGaussianBlurElement>(null)
  const crosshairRef = useRef<SVGGElement>(null)
  const hudCornersRef = useRef<SVGGElement>(null)
  const hudStatusRef = useRef<SVGGElement>(null)
  const connectionLineRef = useRef<SVGLineElement>(null)
  const particlePathRef = useRef<SVGPathElement>(null)
  const particlesRef = useRef<(SVGCircleElement | null)[]>([])
  const tickMarksRef = useRef<(SVGLineElement | null)[]>([])

  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const animatedValuesRef = useRef<number[]>([])
  const particleTweensRef = useRef<gsap.core.Tween[]>([])

  const n = categories.length
  const angleStep = (Math.PI * 2) / n

  // Pre-compute grid polygons
  const gridPolygons = useMemo(
    () => LEVELS.map((level) => buildPolygonPoints(n, () => RADIUS * level)),
    [n]
  )

  // Pre-compute axis endpoints
  const axisEndpoints = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const angle = i * angleStep - Math.PI / 2
        return polarToXY(angle, RADIUS)
      }),
    [n, angleStep]
  )

  // Pre-compute data polygon (full values for target state)
  const dataPoints = useMemo(
    () => buildPolygonPoints(n, (i) => (categories[i].value / 100) * RADIUS),
    [n, categories]
  )

  // Data polygon path (for particles)
  const dataPath = useMemo(
    () => buildPolygonPath(n, (i) => (categories[i].value / 100) * RADIUS),
    [n, categories]
  )

  // Center polygon (all zero — start state)
  const centerPoints = useMemo(
    () => buildPolygonPoints(n, () => 0),
    [n]
  )

  // Pre-compute vertex positions
  const vertexPositions = useMemo(
    () =>
      categories.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2
        return {
          ...polarToXY(angle, (cat.value / 100) * RADIUS),
          angle,
        }
      }),
    [categories, angleStep]
  )

  // Pre-compute label positions (pushed further out)
  const labelPositions = useMemo(
    () =>
      categories.map((cat, i) => {
        const angle = i * angleStep - Math.PI / 2
        const labelR = RADIUS + 38
        const { x, y } = polarToXY(angle, labelR)
        let anchor: 'start' | 'middle' | 'end' = 'middle'
        if (x < CX - 10) anchor = 'end'
        else if (x > CX + 10) anchor = 'start'
        return { x, y, anchor, label: cat.label, value: cat.value }
      }),
    [categories, angleStep]
  )

  // Pre-compute tick mark positions (small dashes at each level on each axis)
  const tickMarks = useMemo(() => {
    const marks: { x1: number; y1: number; x2: number; y2: number }[] = []
    for (let i = 0; i < n; i++) {
      const angle = i * angleStep - Math.PI / 2
      for (const level of LEVELS) {
        const r = RADIUS * level
        const { x, y } = polarToXY(angle, r)
        // Perpendicular tick of length 4
        const perpAngle = angle + Math.PI / 2
        const tickLen = 3
        marks.push({
          x1: x + Math.cos(perpAngle) * tickLen,
          y1: y + Math.sin(perpAngle) * tickLen,
          x2: x - Math.cos(perpAngle) * tickLen,
          y2: y - Math.sin(perpAngle) * tickLen,
        })
      }
    }
    return marks
  }, [n, angleStep])

  // Number of edge particles
  const PARTICLE_COUNT = 8

  // ── Click handler — select/deselect a vertex ─────────────────────────────

  const handleVertexClick = useCallback(
    (index: number) => {
      setSelectedIndex((prev) => (prev === index ? -1 : index))
    },
    []
  )

  // ── Selected vertex — morph polygon to emphasize that category ────────

  useEffect(() => {
    if (!dataPolygonRef.current || !dataStrokeRef.current || !ghostPolygonRef.current) return

    if (selectedIndex >= 0) {
      // Emphasize selected: boost its value, dim others slightly
      const emphPoints = buildPolygonPoints(n, (i) => {
        const base = (categories[i].value / 100) * RADIUS
        if (i === selectedIndex) return Math.min(base * 1.15, RADIUS)
        return base * 0.85
      })
      gsap.to([dataPolygonRef.current, dataStrokeRef.current], {
        attr: { points: emphPoints },
        duration: 0.6,
        ease: 'power3.out',
      })
      gsap.to(ghostPolygonRef.current, {
        attr: { points: emphPoints },
        duration: 0.9,
        ease: 'power2.out',
      })
    } else {
      // Reset to normal data
      gsap.to([dataPolygonRef.current, dataStrokeRef.current], {
        attr: { points: dataPoints },
        duration: 0.6,
        ease: 'power3.out',
      })
      gsap.to(ghostPolygonRef.current, {
        attr: { points: dataPoints },
        duration: 0.9,
        ease: 'power2.out',
      })
    }
  }, [selectedIndex, n, categories, dataPoints])

  // ── GSAP entrance + ambient animations ─────────────────────────────────────

  useEffect(() => {
    const container = containerRef.current
    const svg = svgRef.current
    if (!container || !svg) return

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Initialize animated values
    animatedValuesRef.current = categories.map(() => 0)

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })

      if (prefersReduced) {
        gsap.set(gridLinesRef.current.filter(Boolean), { opacity: 1 })
        gsap.set(axisLinesRef.current.filter(Boolean), { opacity: 1 })
        gsap.set(tickMarksRef.current.filter(Boolean), { opacity: 1 })
        if (dataPolygonRef.current)
          dataPolygonRef.current.setAttribute('points', dataPoints)
        if (dataStrokeRef.current)
          dataStrokeRef.current.setAttribute('points', dataPoints)
        if (ghostPolygonRef.current)
          ghostPolygonRef.current.setAttribute('points', dataPoints)
        gsap.set(vertexDotsRef.current.filter(Boolean), { opacity: 1, scale: 1 })
        gsap.set(labelsRef.current.filter(Boolean), { opacity: 1 })
        if (crosshairRef.current) gsap.set(crosshairRef.current, { opacity: 1 })
        if (hudCornersRef.current) gsap.set(hudCornersRef.current, { opacity: 1 })
        if (hudStatusRef.current) gsap.set(hudStatusRef.current, { opacity: 1 })
        // Set value texts to final
        valueTextsRef.current.forEach((txt, i) => {
          if (txt) txt.textContent = `${categories[i].value}%`
        })
        return
      }

      // 0. HUD corners fade in
      if (hudCornersRef.current) {
        tl.fromTo(
          hudCornersRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.4, ease: 'power2.out' }
        )
      }

      // 0.5 HUD status text
      if (hudStatusRef.current) {
        tl.fromTo(
          hudStatusRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: 'power2.out' },
          '-=0.2'
        )
      }

      // 1. Grid lines draw in (outer → inner)
      const grids = [...gridLinesRef.current.filter(Boolean)].reverse()
      tl.fromTo(
        grids,
        { strokeDashoffset: 2000, opacity: 0 },
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
        }
      )

      // 1.5 Tick marks pop in
      const ticks = tickMarksRef.current.filter(Boolean)
      if (ticks.length > 0) {
        tl.fromTo(
          ticks,
          { opacity: 0, scale: 0, transformOrigin: 'center center' },
          {
            opacity: 1,
            scale: 1,
            duration: 0.3,
            stagger: { each: 0.008, from: 'random' },
            ease: 'back.out(2)',
          },
          '-=0.5'
        )
      }

      // 2. Axis lines sweep outward
      const axes = axisLinesRef.current.filter(Boolean) as SVGLineElement[]
      axes.forEach((axis, i) => {
        tl.fromTo(
          axis,
          { opacity: 0, attr: { x2: CX, y2: CY } },
          {
            opacity: 1,
            attr: { x2: axisEndpoints[i].x, y2: axisEndpoints[i].y },
            duration: 0.6,
            ease: 'power3.out',
          },
          i === 0 ? '-=0.4' : `>-${0.54}`
        )
      })

      // 2.5 Crosshair fades in and rotates
      if (crosshairRef.current) {
        tl.fromTo(
          crosshairRef.current,
          { opacity: 0, scale: 0, transformOrigin: `${CX}px ${CY}px` },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' },
          '-=0.3'
        )
      }

      // 3. Data polygon morphs from center + ghost follows with delay
      if (dataPolygonRef.current && dataStrokeRef.current && ghostPolygonRef.current) {
        dataPolygonRef.current.setAttribute('points', centerPoints)
        dataStrokeRef.current.setAttribute('points', centerPoints)
        ghostPolygonRef.current.setAttribute('points', centerPoints)

        const proxy = { t: 0 }
        tl.to(
          proxy,
          {
            t: 1,
            duration: 1.2,
            ease: 'power3.out',
            onUpdate: () => {
              const pts = buildPolygonPoints(
                n,
                (i) => (categories[i].value / 100) * RADIUS * proxy.t
              )
              dataPolygonRef.current!.setAttribute('points', pts)
              dataStrokeRef.current!.setAttribute('points', pts)
            },
          },
          '-=0.3'
        )

        // Ghost polygon follows with a delay
        const ghostProxy = { t: 0 }
        tl.to(
          ghostProxy,
          {
            t: 1,
            duration: 1.5,
            ease: 'power2.out',
            onUpdate: () => {
              const pts = buildPolygonPoints(
                n,
                (i) => (categories[i].value / 100) * RADIUS * ghostProxy.t
              )
              ghostPolygonRef.current!.setAttribute('points', pts)
            },
          },
          '-=1.0'
        )

        // Animated percentage counters
        categories.forEach((cat, i) => {
          const counterProxy = { val: 0 }
          tl.to(
            counterProxy,
            {
              val: cat.value,
              duration: 1.0,
              ease: 'power2.out',
              onUpdate: () => {
                const rounded = Math.round(counterProxy.val)
                animatedValuesRef.current[i] = rounded
                const txt = valueTextsRef.current[i]
                if (txt) txt.textContent = `${rounded}%`
              },
            },
            '-=1.4'
          )
        })
      }

      // 4. Vertex dots pop in
      const dots = vertexDotsRef.current.filter(Boolean)
      tl.fromTo(
        dots,
        { scale: 0, opacity: 0, transformOrigin: 'center center' },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: { each: 0.06, from: 'random' },
          ease: 'back.out(2)',
        },
        '-=0.8'
      )

      // 5. Labels fade in
      const labels = labelsRef.current.filter(Boolean)
      tl.fromTo(
        labels,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power2.out',
        },
        '-=0.6'
      )

      // ── Ambient animations ──

      // Vertex dot pulse rings
      dots.forEach((dot, i) => {
        const pulseRing = dot?.querySelector('.pulse-ring')
        if (pulseRing) {
          gsap.to(pulseRing, {
            scale: 2.5,
            opacity: 0,
            duration: 2,
            repeat: -1,
            delay: i * 0.4,
            ease: 'power1.out',
            transformOrigin: 'center center',
          })
        }
      })

      // Scan line rotation
      if (scanLineRef.current) {
        gsap.set(scanLineRef.current, { opacity: 0 })
        tl.to(scanLineRef.current, { opacity: 0.35, duration: 0.3 })
        gsap.to(scanLineRef.current, {
          rotation: 360,
          duration: 8,
          repeat: -1,
          ease: 'none',
          transformOrigin: `${CX}px ${CY}px`,
        })
      }

      // Crosshair slow rotation
      if (crosshairRef.current) {
        gsap.to(crosshairRef.current, {
          rotation: -360,
          duration: 20,
          repeat: -1,
          ease: 'none',
          transformOrigin: `${CX}px ${CY}px`,
        })
      }

      // Glow filter pulse
      if (glowFilterRef.current) {
        gsap.to(glowFilterRef.current, {
          attr: { stdDeviation: 6 },
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        })
      }

      // Edge particles traveling along the polygon path
      if (particlePathRef.current) {
        const pathEl = particlePathRef.current
        particlesRef.current.forEach((particle, i) => {
          if (!particle) return
          const tween = gsap.to(particle, {
            motionPath: {
              path: pathEl,
              align: pathEl,
              alignOrigin: [0.5, 0.5],
            },
            duration: 6 + i * 0.5,
            repeat: -1,
            ease: 'none',
            delay: i * (6 / PARTICLE_COUNT),
          })
          particleTweensRef.current.push(tween)
        })
      }
    }, container)

    return () => {
      particleTweensRef.current.forEach((tw) => tw.kill())
      particleTweensRef.current = []
      ctx.revert()
    }
  }, [categories, n, dataPoints, centerPoints, axisEndpoints])

  // ── Hover animations ───────────────────────────────────────────────────────

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return

    const dots = vertexDotsRef.current.filter(Boolean)
    const labels = labelsRef.current.filter(Boolean)

    dots.forEach((dot, i) => {
      if (!dot) return
      const innerDot = dot.querySelector('.vertex-inner')
      const label = labels[i]

      const handleEnter = () => {
        setHoveredIndex(i)
        gsap.to(innerDot, {
          scale: 1.8,
          duration: 0.3,
          ease: 'back.out(2)',
          transformOrigin: 'center center',
        })
        if (label) {
          gsap.to(label, {
            scale: 1.2,
            duration: 0.3,
            ease: 'power2.out',
            transformOrigin: 'center center',
          })
        }
        // Show connection line from center to vertex
        if (connectionLineRef.current) {
          gsap.set(connectionLineRef.current, {
            attr: {
              x1: CX,
              y1: CY,
              x2: CX,
              y2: CY,
            },
            opacity: 0.6,
          })
          gsap.to(connectionLineRef.current, {
            attr: {
              x2: vertexPositions[i].x,
              y2: vertexPositions[i].y,
            },
            duration: 0.4,
            ease: 'power3.out',
          })
        }
      }

      const handleLeave = () => {
        setHoveredIndex(-1)
        gsap.to(innerDot, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
          transformOrigin: 'center center',
        })
        if (label) {
          gsap.to(label, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            transformOrigin: 'center center',
          })
        }
        // Hide connection line
        if (connectionLineRef.current) {
          gsap.to(connectionLineRef.current, {
            attr: { x2: CX, y2: CY },
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
          })
        }
      }

      dot.addEventListener('mouseenter', handleEnter)
      dot.addEventListener('mouseleave', handleLeave)
      dot.addEventListener('click', () => handleVertexClick(i))

      ;(dot as any).__cleanupRadar = () => {
        dot.removeEventListener('mouseenter', handleEnter)
        dot.removeEventListener('mouseleave', handleLeave)
      }
    })

    return () => {
      dots.forEach((dot) => {
        ;(dot as any).__cleanupRadar?.()
      })
    }
  }, [categories, vertexPositions, handleVertexClick])

  // ── HUD corner bracket dimensions ──
  const bracketLen = 20
  const bracketPad = 8
  const bracketStroke = 1.5

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-auto max-w-[420px] mx-auto"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Neon glow filter */}
          <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur
              ref={glowFilterRef}
              in="SourceGraphic"
              stdDeviation="3"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Dot glow filter */}
          <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
          </filter>

          {/* Connection line glow */}
          <filter id="conn-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
          </filter>

          {/* Particle glow */}
          <filter id="particle-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
          </filter>

          {/* Data polygon gradient fill */}
          <linearGradient id="radar-fill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.18" />
            <stop offset="50%" stopColor="var(--color-secondary-500)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0.18" />
          </linearGradient>

          {/* Ghost polygon gradient (more transparent) */}
          <linearGradient id="ghost-fill-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="var(--color-secondary-500)" stopOpacity="0.04" />
          </linearGradient>

          {/* Stroke gradient */}
          <linearGradient id="radar-stroke-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-primary-400)" />
            <stop offset="50%" stopColor="var(--color-secondary-400)" />
            <stop offset="100%" stopColor="var(--color-primary-400)" />
          </linearGradient>

          {/* Radial gradient for center glow */}
          <radialGradient id="center-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" />
          </radialGradient>

          {/* Scan line cone gradient */}
          <linearGradient id="scan-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-500)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--color-primary-500)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── HUD corner brackets ───────────────────── */}
        <g ref={hudCornersRef} opacity={0}>
          {/* Top-left */}
          <polyline
            points={`${bracketPad},${bracketPad + bracketLen} ${bracketPad},${bracketPad} ${bracketPad + bracketLen},${bracketPad}`}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth={bracketStroke}
            strokeOpacity={0.4}
          />
          {/* Top-right */}
          <polyline
            points={`${SIZE - bracketPad - bracketLen},${bracketPad} ${SIZE - bracketPad},${bracketPad} ${SIZE - bracketPad},${bracketPad + bracketLen}`}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth={bracketStroke}
            strokeOpacity={0.4}
          />
          {/* Bottom-left */}
          <polyline
            points={`${bracketPad},${SIZE - bracketPad - bracketLen} ${bracketPad},${SIZE - bracketPad} ${bracketPad + bracketLen},${SIZE - bracketPad}`}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth={bracketStroke}
            strokeOpacity={0.4}
          />
          {/* Bottom-right */}
          <polyline
            points={`${SIZE - bracketPad - bracketLen},${SIZE - bracketPad} ${SIZE - bracketPad},${SIZE - bracketPad} ${SIZE - bracketPad},${SIZE - bracketPad - bracketLen}`}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth={bracketStroke}
            strokeOpacity={0.4}
          />
        </g>

        {/* ── HUD status text ───────────────────── */}
        <g ref={hudStatusRef} opacity={0}>
          <text
            x={bracketPad + 4}
            y={bracketPad + bracketLen + 16}
            fill="var(--color-primary-500)"
            fillOpacity={0.5}
            fontSize="8"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight={500}
            letterSpacing="0.15em"
          >
            SYS.ANALYSIS
          </text>
          <text
            x={SIZE - bracketPad - 4}
            y={bracketPad + bracketLen + 16}
            textAnchor="end"
            fill="var(--color-primary-500)"
            fillOpacity={0.4}
            fontSize="7"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight={400}
          >
            v2.05.0
          </text>
          <text
            x={bracketPad + 4}
            y={SIZE - bracketPad - bracketLen - 6}
            fill="var(--color-primary-500)"
            fillOpacity={0.35}
            fontSize="7"
            fontFamily="'JetBrains Mono', monospace"
            fontWeight={400}
          >
            {n} CATEGORIES
          </text>
        </g>

        {/* Center ambient glow */}
        <circle cx={CX} cy={CY} r={RADIUS} fill="url(#center-glow)" />

        {/* Grid lines (concentric polygons) */}
        {gridPolygons.map((points, i) => (
          <polygon
            key={`grid-${i}`}
            ref={(el) => { gridLinesRef.current[i] = el }}
            points={points}
            fill="none"
            stroke="var(--text-tertiary)"
            strokeOpacity={i === 3 ? 0.2 : 0.08}
            strokeWidth={i === 3 ? 1.5 : 0.75}
            strokeDasharray="2000"
            opacity={0}
          />
        ))}

        {/* Level labels on first axis */}
        {LEVELS.map((level, i) => {
          const r = RADIUS * level
          const pos = polarToXY(-Math.PI / 2, r)
          return (
            <text
              key={`level-${i}`}
              x={pos.x + 6}
              y={pos.y + 3}
              fill="var(--text-tertiary)"
              fillOpacity={0.3}
              fontSize="7"
              fontFamily="'JetBrains Mono', monospace"
            >
              {LEVEL_LABELS[i]}
            </text>
          )
        })}

        {/* Tick marks on axes */}
        {tickMarks.map((mark, i) => (
          <line
            key={`tick-${i}`}
            ref={(el) => { tickMarksRef.current[i] = el }}
            x1={mark.x1}
            y1={mark.y1}
            x2={mark.x2}
            y2={mark.y2}
            stroke="var(--color-primary-500)"
            strokeWidth={0.75}
            strokeOpacity={0.25}
            opacity={0}
          />
        ))}

        {/* Axis lines */}
        {axisEndpoints.map((_end, i) => (
          <line
            key={`axis-${i}`}
            ref={(el) => { axisLinesRef.current[i] = el }}
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY}
            stroke="var(--text-tertiary)"
            strokeOpacity={0.12}
            strokeWidth={0.75}
            strokeDasharray="4 4"
            opacity={0}
          />
        ))}

        {/* ── Crosshair at center ───────────────────── */}
        <g ref={crosshairRef} opacity={0}>
          {/* Horizontal */}
          <line
            x1={CX - 10}
            y1={CY}
            x2={CX + 10}
            y2={CY}
            stroke="var(--color-primary-500)"
            strokeWidth={0.75}
            strokeOpacity={0.5}
          />
          {/* Vertical */}
          <line
            x1={CX}
            y1={CY - 10}
            x2={CX}
            y2={CY + 10}
            stroke="var(--color-primary-500)"
            strokeWidth={0.75}
            strokeOpacity={0.5}
          />
          {/* Center ring */}
          <circle
            cx={CX}
            cy={CY}
            r={6}
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth={0.75}
            strokeOpacity={0.3}
          />
          {/* Inner dot */}
          <circle
            cx={CX}
            cy={CY}
            r={1.5}
            fill="var(--color-primary-500)"
            fillOpacity={0.6}
          />
        </g>

        {/* Scan line (rotating) */}
        <line
          ref={scanLineRef}
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY - RADIUS}
          stroke="var(--color-primary-500)"
          strokeOpacity={0}
          strokeWidth={1}
          style={{ filter: 'url(#dot-glow)' }}
        />

        {/* ── Ghost polygon (afterimage) ───────────── */}
        <polygon
          ref={ghostPolygonRef}
          points={centerPoints}
          fill="url(#ghost-fill-gradient)"
          stroke="var(--color-primary-500)"
          strokeWidth={0.5}
          strokeOpacity={0.15}
          strokeDasharray="3 3"
        />

        {/* Data polygon fill */}
        <polygon
          ref={dataPolygonRef}
          points={centerPoints}
          fill="url(#radar-fill-gradient)"
        />

        {/* Data polygon stroke with glow */}
        <polygon
          ref={dataStrokeRef}
          points={centerPoints}
          fill="none"
          stroke="url(#radar-stroke-gradient)"
          strokeWidth={2}
          strokeLinejoin="round"
          filter="url(#radar-glow)"
        />

        {/* ── Hidden path for particle motion ───── */}
        <path
          ref={particlePathRef}
          d={dataPath}
          fill="none"
          stroke="none"
        />

        {/* ── Edge particles ───────────────────── */}
        {Array.from({ length: PARTICLE_COUNT }, (_, i) => (
          <circle
            key={`particle-${i}`}
            ref={(el) => { particlesRef.current[i] = el }}
            r={i % 2 === 0 ? 2 : 1.5}
            fill="var(--color-primary-400)"
            opacity={0.7 - i * 0.06}
            filter="url(#particle-glow)"
          />
        ))}

        {/* ── Connection line (hover: center → vertex) ───── */}
        <line
          ref={connectionLineRef}
          x1={CX}
          y1={CY}
          x2={CX}
          y2={CY}
          stroke="var(--color-primary-400)"
          strokeWidth={1}
          strokeDasharray="4 3"
          opacity={0}
          filter="url(#conn-glow)"
        />

        {/* Vertex dots */}
        {vertexPositions.map((pos, i) => {
          const isSelected = selectedIndex === i
          const isHovered = hoveredIndex === i
          return (
            <g
              key={`dot-${i}`}
              ref={(el) => { vertexDotsRef.current[i] = el }}
              opacity={0}
              style={{ cursor: 'pointer' }}
            >
              {/* Pulse ring */}
              <circle
                className="pulse-ring"
                cx={pos.x}
                cy={pos.y}
                r={5}
                fill="none"
                stroke={isSelected ? 'var(--color-secondary-400)' : 'var(--color-primary-500)'}
                strokeWidth={1}
                opacity={0.6}
              />

              {/* Selection ring (only when selected) */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={12}
                  fill="none"
                  stroke="var(--color-secondary-400)"
                  strokeWidth={1}
                  strokeOpacity={0.5}
                  strokeDasharray="3 2"
                />
              )}

              {/* Glow behind dot */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isHovered || isSelected ? 12 : 8}
                fill={isSelected ? 'var(--color-secondary-500)' : 'var(--color-primary-500)'}
                opacity={isHovered || isSelected ? 0.25 : 0.15}
                filter="url(#dot-glow)"
              />

              {/* Main dot */}
              <circle
                className="vertex-inner"
                cx={pos.x}
                cy={pos.y}
                r={5}
                fill={
                  isSelected
                    ? 'var(--color-secondary-400)'
                    : isHovered
                      ? 'var(--color-primary-400)'
                      : 'var(--color-primary-500)'
                }
                stroke="var(--bg-primary)"
                strokeWidth={1.5}
              />

              {/* Invisible larger hit area */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={20}
                fill="transparent"
              />
            </g>
          )
        })}

        {/* Labels + animated values */}
        {labelPositions.map((lbl, i) => {
          const isSelected = selectedIndex === i
          const isHovered = hoveredIndex === i
          const isHighlighted = isSelected || isHovered
          return (
            <g
              key={`label-${i}`}
              ref={(el) => { labelsRef.current[i] = el }}
              opacity={0}
            >
              <text
                x={lbl.x}
                y={lbl.y - 6}
                textAnchor={lbl.anchor}
                fill={
                  isSelected
                    ? 'var(--color-secondary-400)'
                    : isHovered
                      ? 'var(--color-primary-400)'
                      : 'var(--text-secondary)'
                }
                fontSize="11"
                fontFamily="Inter, system-ui, sans-serif"
                fontWeight={isHighlighted ? 600 : 400}
                className="transition-colors duration-200"
              >
                {lbl.label}
              </text>
              <text
                ref={(el) => { valueTextsRef.current[i] = el }}
                x={lbl.x}
                y={lbl.y + 10}
                textAnchor={lbl.anchor}
                fill={
                  isSelected
                    ? 'var(--color-secondary-500)'
                    : isHovered
                      ? 'var(--color-primary-500)'
                      : 'var(--text-tertiary)'
                }
                fontSize="10"
                fontFamily="'JetBrains Mono', monospace"
                fontWeight={500}
                className="transition-colors duration-200"
              >
                0%
              </text>
            </g>
          )
        })}
      </svg>

      {/* ── Hovered / selected category tooltip ──────── */}
      {(hoveredIndex >= 0 || selectedIndex >= 0) && (
        <div
          className={cn(
            'absolute left-1/2 -translate-x-1/2 bottom-0',
            'px-4 py-2.5 rounded-lg',
            'bg-[var(--bg-secondary)]/90 backdrop-blur-md',
            'border',
            selectedIndex >= 0
              ? 'border-secondary-500/30'
              : 'border-primary-500/20',
            'text-center pointer-events-none',
            'animate-in fade-in duration-200'
          )}
        >
          <div className="flex items-center gap-2 justify-center mb-1">
            <div
              className={cn(
                'w-1.5 h-1.5 rounded-full',
                selectedIndex >= 0 ? 'bg-secondary-400' : 'bg-primary-400'
              )}
            />
            <p
              className={cn(
                'text-sm font-medium',
                selectedIndex >= 0 ? 'text-secondary-400' : 'text-primary-400'
              )}
            >
              {categories[selectedIndex >= 0 ? selectedIndex : hoveredIndex].label}
            </p>
          </div>
          <p className="text-xs font-mono text-[var(--text-tertiary)]">
            {categories[selectedIndex >= 0 ? selectedIndex : hoveredIndex].value}% proficiency
          </p>
          {selectedIndex >= 0 && (
            <p className="text-[10px] font-mono text-[var(--text-tertiary)] mt-1 opacity-60">
              click to deselect
            </p>
          )}
        </div>
      )}
    </div>
  )
}
