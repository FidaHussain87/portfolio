import { useRef, useState, useEffect, useCallback, useMemo, useLayoutEffect } from 'react'
import { gsap, ScrollTrigger } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { Container } from '@components/layout'
import { SectionHeading, Card, GlowOrb, ParallaxLayer, SkillRadar, SkillIcon } from '@components/ui'
import { getCategoryColor, type IconColorTheme } from '@components/ui/SkillIcon'
import { Layers, Code, Layout, Server, Cloud, Database, Wrench } from 'lucide-react'
import { skillCategories } from '@data/index'
import type { SkillCategory, Skill } from '@data/index'

// ─── Radar Chart Data ────────────────────────────────────────────────────────

const radarCategories = skillCategories.map((cat: SkillCategory) => ({
  label: cat.label,
  value: Math.round(
    cat.skills.reduce((sum: number, s: Skill) => sum + s.proficiency, 0) / cat.skills.length
  ),
}))

// ─── Constants ────────────────────────────────────────────────────────────────

const ALL_TAB_ID = 'all'
const CARDS_BESIDE_RADAR = 8

const CATEGORY_TABS_META: Record<
  string,
  {
    Icon: React.ComponentType<{ size?: number; className?: string }>
    color: IconColorTheme
  }
> = {
  [ALL_TAB_ID]: { Icon: Layers, color: 'primary' },
  languages: { Icon: Code, color: 'primary' },
  frontend: { Icon: Layout, color: 'secondary' },
  backend: { Icon: Server, color: 'accent' },
  cloud: { Icon: Cloud, color: 'secondary' },
  databases: { Icon: Database, color: 'primary' },
  tools: { Icon: Wrench, color: 'neutral' },
}

const TAB_ACTIVE_GLOW: Record<IconColorTheme, string> = {
  primary: 'text-primary-400 drop-shadow-[0_0_6px_rgba(0,229,219,0.6)]',
  secondary: 'text-secondary-300 drop-shadow-[0_0_6px_rgba(118,26,255,0.6)]',
  accent: 'text-accent-400 drop-shadow-[0_0_6px_rgba(255,26,118,0.6)]',
  neutral: 'text-[var(--text-secondary)] drop-shadow-[0_0_4px_rgba(179,185,204,0.4)]',
}

const FILTER_TABS = [
  { id: ALL_TAB_ID, label: 'All' },
  ...skillCategories.map((c: SkillCategory) => ({ id: c.id, label: c.label })),
] as const

// ─── Skill Card ──────────────────────────────────────────────────────────────

function SkillCard({ skill }: { skill: Skill & { categoryId: string } }) {
  const iconColor = getCategoryColor(skill.categoryId)
  return (
    <div data-skill-card className="group will-change-transform">
      <Card className="p-4 sm:p-5" hover={false}>
        <div className="flex items-center gap-3 mb-3">
          {skill.icon && (
            <SkillIcon name={skill.icon} size={20} colorTheme={iconColor} orb />
          )}
          <p className="text-sm font-medium text-[var(--text-primary)]">
            {skill.name}
          </p>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">proficiency</span>
            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">{skill.proficiency}%</span>
          </div>
          <div className="h-2 w-full rounded-full overflow-hidden bg-[var(--border-default)]">
            <div
              data-proficiency-bar
              data-proficiency={skill.proficiency}
              className="h-full rounded-full bg-gradient-to-r from-primary-500 to-secondary-500"
              style={{ width: 0 }}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Skills Section ───────────────────────────────────────────────────────────

export function Skills() {
  const [activeTab, setActiveTab] = useState<string>(ALL_TAB_ID)
  const prevTabRef = useRef<string>(ALL_TAB_ID)
  const sectionRef = useRef<HTMLElement>(null)
  const topGridRef = useRef<HTMLDivElement>(null)
  const bottomGridRef = useRef<HTMLDivElement>(null)
  const tabsRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)
  const tabButtonsRef = useRef<Map<string, HTMLButtonElement>>(new Map())
  const hasAnimatedRef = useRef(false)
  const switchCountRef = useRef(0)

  const visibleSkills = useMemo(() => {
    if (activeTab === ALL_TAB_ID) {
      return skillCategories.flatMap((cat: SkillCategory) =>
        cat.skills.map((skill: Skill) => ({ ...skill, categoryId: cat.id }))
      )
    }
    const category = skillCategories.find((c): c is SkillCategory => c.id === activeTab)
    return category?.skills.map((skill: Skill) => ({ ...skill, categoryId: category.id })) ?? []
  }, [activeTab])

  const topSkills = useMemo(() => visibleSkills.slice(0, CARDS_BESIDE_RADAR), [visibleSkills])
  const bottomSkills = useMemo(() => visibleSkills.slice(CARDS_BESIDE_RADAR), [visibleSkills])

  // ── Helpers ──────────────────────────────────────────────────────────────

  const getAllCards = useCallback(() => {
    const top = topGridRef.current?.querySelectorAll<HTMLElement>('[data-skill-card]') ?? []
    const bot = bottomGridRef.current?.querySelectorAll<HTMLElement>('[data-skill-card]') ?? []
    return [...Array.from(top), ...Array.from(bot)]
  }, [])

  const moveUnderline = useCallback((tabId: string) => {
    const btn = tabButtonsRef.current.get(tabId)
    const container = tabsRef.current
    const indicator = underlineRef.current
    if (!btn || !container || !indicator) return
    const cRect = container.getBoundingClientRect()
    const bRect = btn.getBoundingClientRect()
    gsap.to(indicator, { x: bRect.left - cRect.left, width: bRect.width, duration: 0.35, ease: 'power3.out' })
  }, [])

  useEffect(() => { moveUnderline(activeTab) }, [activeTab, moveUnderline])
  useEffect(() => {
    const h = () => moveUnderline(activeTab)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [activeTab, moveUnderline])

  const animateBars = useCallback((container: HTMLElement, delay = 0) => {
    const bars = container.querySelectorAll<HTMLElement>('[data-proficiency-bar]')
    bars.forEach((bar, i) => {
      const target = bar.dataset.proficiency ?? '0'
      gsap.fromTo(bar, { width: '0%' }, {
        width: `${target}%`, duration: 0.8, delay: delay + i * 0.03, ease: 'power2.out',
        onComplete: () => {
          gsap.fromTo(bar,
            { boxShadow: '0 0 0px rgba(0,229,219,0)' },
            { boxShadow: '0 0 12px rgba(0,229,219,0.4)', duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.inOut' }
          )
        },
      })
    })
  }, [])

  // ── Initial entrance — ScrollTrigger boot-sequence ───────────────────────

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const cards = getAllCards()
      if (cards.length === 0) return

      if (prefersReduced) {
        gsap.set(cards, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotateX: 0 })
        if (topGridRef.current) animateBars(topGridRef.current)
        if (bottomGridRef.current) animateBars(bottomGridRef.current)
        hasAnimatedRef.current = true
        return
      }

      gsap.set(cards, {
        opacity: 0, y: 50, scale: 0.88, filter: 'blur(8px)',
        rotateX: -15, transformPerspective: 800, transformOrigin: 'center bottom',
      })

      ScrollTrigger.create({
        trigger: section, start: 'top 75%', once: true,
        onEnter: () => {
          hasAnimatedRef.current = true
          gsap.to(cards, {
            opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', rotateX: 0,
            duration: 0.7, stagger: { each: 0.04, from: 'random' }, ease: 'cyberSnap',
            onComplete: () => {
              if (topGridRef.current) animateBars(topGridRef.current)
              if (bottomGridRef.current) animateBars(bottomGridRef.current, 0.2)
            },
          })
        },
      })
    }, section)

    return () => ctx.revert()
  }, [animateBars, getAllCards])

  // ── Tab change ───────────────────────────────────────────────────────────

  const handleTabChange = useCallback((tabId: string) => {
    if (tabId === activeTab) return
    prevTabRef.current = activeTab
    switchCountRef.current += 1
    setActiveTab(tabId)
  }, [activeTab])

  // ── Hide cards before paint on tab switch (prevents position flash) ──────

  useLayoutEffect(() => {
    // Only run on tab switches after initial entrance has played
    if (!hasAnimatedRef.current || switchCountRef.current === 0) return
    const cards = getAllCards()
    // Use gsap.set for immediate inline style application (synchronous)
    gsap.set(cards, { opacity: 0, x: 0, scale: 1, filter: 'blur(0px)' })
  }, [activeTab, getAllCards])

  // ── Animate cards in after tab switch ────────────────────────────────────

  useEffect(() => {
    if (!hasAnimatedRef.current || switchCountRef.current === 0) return

    const cards = getAllCards()
    if (cards.length === 0) return

    const prevIdx = FILTER_TABS.findIndex((t) => t.id === prevTabRef.current)
    const currIdx = FILTER_TABS.findIndex((t) => t.id === activeTab)
    const direction = currIdx > prevIdx ? 1 : -1

    // Cards are already hidden (opacity:0) from useLayoutEffect.
    // Now animate them in from the correct direction.
    gsap.fromTo(cards,
      {
        opacity: 0,
        x: 40 * direction,
        scale: 0.92,
        filter: 'blur(6px)',
        rotateX: -8,
        transformPerspective: 800,
        transformOrigin: 'center bottom',
      },
      {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        rotateX: 0,
        duration: 0.55,
        stagger: { each: 0.03, from: 'start' },
        ease: 'power3.out',
        onComplete: () => {
          if (topGridRef.current) animateBars(topGridRef.current)
          if (bottomGridRef.current) animateBars(bottomGridRef.current, 0.1)
        },
      }
    )
  }, [activeTab, animateBars, getAllCards])

  // ── Hover — 3D tilt + glow ──────────────────────────────────────────────

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia('(hover: none)').matches) return

    const handleEnter = (e: Event) => {
      const card = e.currentTarget as HTMLElement
      const iconOrb = card.querySelector('.skill-icon-orb')
      const bar = card.querySelector<HTMLElement>('[data-proficiency-bar]')
      gsap.to(card, {
        y: -8, scale: 1.03, rotateX: -2, rotateY: 2,
        boxShadow: '0 8px 40px rgba(0,229,219,0.15), 0 0 20px rgba(0,229,219,0.08)',
        transformPerspective: 800, duration: 0.35, ease: 'power2.out',
      })
      if (iconOrb) gsap.to(iconOrb, { scale: 1.2, rotation: 10, duration: 0.35, ease: 'back.out(1.7)' })
      if (bar) gsap.to(bar, { boxShadow: '0 0 14px rgba(0,229,219,0.5)', duration: 0.3 })
    }

    const handleLeave = (e: Event) => {
      const card = e.currentTarget as HTMLElement
      const iconOrb = card.querySelector('.skill-icon-orb')
      const bar = card.querySelector<HTMLElement>('[data-proficiency-bar]')
      gsap.to(card, {
        y: 0, scale: 1, rotateX: 0, rotateY: 0,
        boxShadow: '0 0 0px rgba(0,0,0,0)', duration: 0.4, ease: 'power3.out',
      })
      if (iconOrb) gsap.to(iconOrb, { scale: 1, rotation: 0, duration: 0.3 })
      if (bar) gsap.to(bar, { boxShadow: '0 0 0px rgba(0,229,219,0)', duration: 0.3 })
    }

    const attach = () => {
      const cards = section.querySelectorAll<HTMLElement>('[data-skill-card]')
      cards.forEach((c) => {
        c.addEventListener('mouseenter', handleEnter)
        c.addEventListener('mouseleave', handleLeave)
      })
      return cards
    }

    let cards = attach()
    const observer = new MutationObserver(() => {
      cards.forEach((c) => { c.removeEventListener('mouseenter', handleEnter); c.removeEventListener('mouseleave', handleLeave) })
      cards = attach()
    })
    observer.observe(section, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      cards.forEach((c) => { c.removeEventListener('mouseenter', handleEnter); c.removeEventListener('mouseleave', handleLeave) })
    }
  }, [])

  // ── Tab button refs ──────────────────────────────────────────────────────

  const setTabRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      if (el) tabButtonsRef.current.set(id, el)
      else tabButtonsRef.current.delete(id)
    }, []
  )

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <section id="skills" ref={sectionRef} className="section-padding relative overflow-hidden">
      <ParallaxLayer speed={-0.3}>
        <GlowOrb color="primary" size={400} className="-top-40 -right-40" />
      </ParallaxLayer>
      <ParallaxLayer speed={0.2}>
        <GlowOrb color="secondary" size={350} className="-bottom-32 -left-32" />
      </ParallaxLayer>

      <Container className="relative z-10">
        <SectionHeading label="EXPERTISE" title="Skills & Technologies" />

        {/* ── Tabs ────────────────────────────────────────────────── */}
        <div className="relative mb-8 sm:mb-10">
          <div
            ref={tabsRef}
            className="relative flex gap-3 overflow-x-auto scrollbar-none pb-2 justify-start md:justify-center"
          >
            {FILTER_TABS.map((tab) => {
              const meta = CATEGORY_TABS_META[tab.id]
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  ref={setTabRef(tab.id)}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    'relative whitespace-nowrap rounded-lg px-3 sm:px-5 py-2 sm:py-2.5',
                    'text-sm font-medium transition-all duration-300',
                    'inline-flex items-center gap-1.5 flex-shrink-0',
                    isActive
                      ? 'text-[var(--text-primary)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'
                  )}
                >
                  {meta && (
                    <meta.Icon
                      size={16}
                      className={cn('transition-all duration-300', isActive && TAB_ACTIVE_GLOW[meta.color])}
                    />
                  )}
                  {tab.label}
                </button>
              )
            })}
            <div
              ref={underlineRef}
              className="absolute bottom-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-500 bg-[length:200%_100%] animate-[gradient-flow_3s_linear_infinite]"
              style={{ width: 0 }}
            />
          </div>
        </div>

        {/* ── Radar (left) + first cards (right) ──────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Radar */}
          <div className="lg:w-[38%] flex-shrink-0 mx-auto lg:mx-0 max-w-[360px] lg:max-w-none w-full">
            <SkillRadar categories={radarCategories} />
          </div>

          {/* Cards beside radar */}
          <div className="lg:w-[62%] min-w-0">
            <div ref={topGridRef} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {topSkills.map((skill) => (
                <SkillCard key={`${skill.categoryId}-${skill.name}`} skill={skill} />
              ))}
            </div>
          </div>
        </div>

        {/* ── Remaining cards — full width below radar + top cards ── */}
        {bottomSkills.length > 0 && (
          <div ref={bottomGridRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6">
            {bottomSkills.map((skill) => (
              <SkillCard key={`${skill.categoryId}-${skill.name}`} skill={skill} />
            ))}
          </div>
        )}
      </Container>

      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  )
}
