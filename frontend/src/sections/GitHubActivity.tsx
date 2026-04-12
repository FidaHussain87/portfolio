import { useRef, useEffect } from 'react'
import { cn } from '@utils/cn'
import { gsap } from '@utils/gsap-register'
import { Container } from '@components/layout'
import {
  SectionHeading,
  Card,
  AnimatedCounter,
  Badge,
  GlowOrb,
} from '@components/ui'
import {
  githubStats,
  githubAchievements,
  contributionGrid,
} from '@data/index'
import type { ActivityLevel, GitHubAchievement, ContributionWeek } from '@data/index'
import {
  Star,
  GitFork,
  Users,
  Award,
  ExternalLink,
} from 'lucide-react'

// ─── Constants ───────────────────────────────────────────────────────────────

const MONTH_LABELS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

const LEVEL_COLORS: Record<ActivityLevel, string> = {
  0: 'bg-[var(--border-subtle)]',
  1: 'bg-primary-900',
  2: 'bg-primary-700',
  3: 'bg-primary-500',
  4: 'bg-primary-300',
}

// Achievement icon mapping (since data stores string identifiers)
const ACHIEVEMENT_ICONS: Record<string, typeof Award> = {
  'arctic-code-vault': Award,
  'pull-shark': GitFork,
  'yolo': Star,
  'quickdraw': GitFork,
  'starstruck': Star,
}

// ─── Stats Row ───────────────────────────────────────────────────────────────

function StatsRow() {
  const containerRef = useRef<HTMLDivElement>(null)

  const stats = [
    {
      label: 'Repos',
      value: githubStats.totalRepos,
      suffix: '+',
      icon: GitFork,
    },
    {
      label: 'Stars',
      value: githubStats.totalStars,
      suffix: '+',
      icon: Star,
    },
    {
      label: 'Forks',
      value: githubStats.totalForks,
      suffix: '+',
      icon: GitFork,
    },
    {
      label: 'Contributions',
      value: githubStats.totalContributions,
      suffix: '+',
      icon: Award,
    },
    {
      label: 'Followers',
      value: githubStats.followers,
      suffix: '+',
      icon: Users,
    },
  ]

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const cards = el.querySelectorAll<HTMLElement>('.stat-card')

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: (i: number) => 30 + i * 10,   // staggered distance
        scale: 0.9,
        rotation: (i: number) => (i % 2 === 0 ? -3 : 3),  // alternating tilt
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
        onComplete: () => {
          // Glow flash when counters start
          cards.forEach((card) => {
            gsap.fromTo(card, {
              boxShadow: '0 0 0px rgba(0,229,219,0)',
            }, {
              boxShadow: '0 0 20px rgba(0,229,219,0.15)',
              duration: 0.4,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut',
            })
          })
        },
      })
    }, el)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 mb-8 sm:mb-12">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="stat-card p-3 sm:p-5 text-center">
            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-400 mx-auto mb-1.5 sm:mb-2" />
            <div className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-[var(--text-primary)]">
              <AnimatedCounter end={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-xs text-[var(--text-tertiary)] mt-1 uppercase tracking-wide">
              {stat.label}
            </p>
          </Card>
        )
      })}
    </div>
  )
}

// ─── Contribution Grid ───────────────────────────────────────────────────────

function ContributionGrid() {
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = gridRef.current
    if (!el) return

    const cells = el.querySelectorAll('.contrib-cell')
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      // ── 2D wave grid entrance ──
      gsap.from(cells, {
        opacity: 0,
        scale: 0,
        duration: 0.3,
        stagger: {
          each: 0.003,
          grid: [7, 52],
          axis: 'x',
        },
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // ── Heatmap ambient pulse (active cells only) ──
      if (!prefersReduced) {
        const activeCells = el.querySelectorAll('.contrib-cell-active')
        if (activeCells.length) {
          gsap.fromTo(activeCells,
            { opacity: 0.7 },
            {
              opacity: 1,
              duration: 2,
              stagger: {
                each: 0.02,
                from: 'random',
                repeat: -1,
                yoyo: true,
              },
              ease: 'sine.inOut',
            }
          )
        }
      }
    }, el)

    return () => {
      ctx.revert()
    }
  }, [])

  // Calculate approximate month positions (each month ~ 4.33 weeks)
  const monthPositions = MONTH_LABELS.map((label, idx) => ({
    label,
    col: Math.floor(idx * (52 / 12)),
  }))

  return (
    <Card className="p-3 sm:p-6 mb-8 sm:mb-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[var(--text-secondary)]">
          Contribution Activity
        </h3>
        <a
          href={githubStats.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300 transition-colors"
        >
          View on GitHub
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Scrollable grid wrapper with fade edges on mobile */}
      <div className="relative">
        <div
          className={cn(
            'overflow-x-auto',
            // Custom thin scrollbar styling
            '[&::-webkit-scrollbar]:h-1.5',
            '[&::-webkit-scrollbar-track]:bg-transparent',
            '[&::-webkit-scrollbar-thumb]:rounded-full',
            '[&::-webkit-scrollbar-thumb]:bg-[var(--border-subtle)]',
          )}
        >
          <div ref={gridRef} className="min-w-[720px]">
            {/* Month labels */}
            <div className="flex ml-8 mb-1">
              {monthPositions.map((month) => (
                <span
                  key={month.label}
                  className="text-[10px] text-[var(--text-tertiary)]"
                  style={{
                    position: 'relative',
                    left: `${(month.col / 52) * 100}%`,
                    width: `${(1 / 12) * 100}%`,
                  }}
                >
                  {month.label}
                </span>
              ))}
            </div>

            {/* Grid body: day labels + cells */}
            <div className="flex gap-[3px]">
              {/* Day labels column */}
              <div className="flex flex-col gap-[3px] pr-1 flex-shrink-0 w-7">
                {DAY_LABELS.map((label, i) => (
                  <div
                    key={i}
                    className="h-[13px] flex items-center justify-end"
                  >
                    <span className="text-[10px] text-[var(--text-tertiary)] leading-none">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Weeks grid */}
              <div className="flex gap-[3px] flex-1">
                {contributionGrid.map((week: ContributionWeek) => (
                  <div key={week.weekIndex} className="flex flex-col gap-[3px]">
                    {week.days.map((level: number, dayIdx: number) => (
                      <div
                        key={dayIdx}
                        className={cn(
                          'contrib-cell w-[13px] h-[13px] rounded-[2px]',
                          level > 0 && 'contrib-cell-active',
                          LEVEL_COLORS[level as ActivityLevel]
                        )}
                        title={`Activity level: ${level}`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex items-center justify-end gap-1.5 mt-3">
              <span className="text-[10px] text-[var(--text-tertiary)] mr-1">Less</span>
              {([0, 1, 2, 3, 4] as ActivityLevel[]).map((level) => (
                <div
                  key={level}
                  className={cn(
                    'w-[13px] h-[13px] rounded-[2px]',
                    LEVEL_COLORS[level]
                  )}
                />
              ))}
              <span className="text-[10px] text-[var(--text-tertiary)] ml-1">More</span>
            </div>
          </div>
        </div>

        {/* Right fade edge - visible only when content overflows (mobile/tablet) */}
        <div
          className="absolute top-0 right-0 bottom-0 w-8 pointer-events-none sm:hidden"
          style={{
            background: 'linear-gradient(to right, transparent, var(--bg-card, var(--bg-primary)))',
          }}
        />
      </div>

      {/* Scroll hint for mobile */}
      <p className="text-[10px] text-[var(--text-tertiary)] text-center mt-2 sm:hidden">
        Swipe to see full activity
      </p>
    </Card>
  )
}

// ─── Achievement Badges ──────────────────────────────────────────────────────

function AchievementBadges() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const cards = el.querySelectorAll('.achievement-card')

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })

      // ── Achievement hover ──
      if (!window.matchMedia('(hover: none)').matches) {
        cards.forEach((card) => {
          const iconCircle = card.querySelector('.achievement-icon-circle')

          card.addEventListener('mouseenter', () => {
            gsap.to(card, {
              y: -6,
              scale: 1.05,
              duration: 0.3,
              ease: 'power2.out',
            })
            if (iconCircle) {
              gsap.to(iconCircle, {
                boxShadow: '0 0 20px rgba(0,229,219,0.3)',
                scale: 1.1,
                duration: 0.3,
                ease: 'back.out(1.7)',
              })
            }
          })

          card.addEventListener('mouseleave', () => {
            gsap.to(card, {
              y: 0,
              scale: 1,
              duration: 0.4,
              ease: 'power3.out',
            })
            if (iconCircle) {
              gsap.to(iconCircle, {
                boxShadow: '0 0 0px rgba(0,0,0,0)',
                scale: 1,
                duration: 0.35,
                ease: 'power2.out',
              })
            }
          })
        })
      }
    }, el)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <div ref={containerRef}>
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-4">
        Achievements
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
        {githubAchievements.map((achievement: GitHubAchievement) => {
          const Icon = ACHIEVEMENT_ICONS[achievement.icon] || Award
          return (
            <Card
              key={achievement.id}
              glow
              className="achievement-card p-3 sm:p-5 flex flex-col items-center text-center gap-2 sm:gap-3 will-change-transform"
            >
              <div
                className={cn(
                  'achievement-icon-circle w-12 h-12 rounded-full flex items-center justify-center',
                  'bg-gradient-to-br from-primary-500/20 to-secondary-500/20',
                  'border border-primary-500/20'
                )}
              >
                <Icon className="w-5 h-5 text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                  {achievement.title}
                </p>
                <p className="text-xs text-[var(--text-tertiary)] line-clamp-2">
                  {achievement.description}
                </p>
              </div>
              <Badge variant="primary" glow>
                Earned
              </Badge>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

// ─── GitHub Activity Section ─────────────────────────────────────────────────

export function GitHubActivity() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      gsap.from(section, {
        filter: prefersReduced ? 'none' : 'blur(20px)',
        opacity: 0,
        duration: prefersReduced ? 0.5 : 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      })
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="github"
      className="section-padding relative overflow-hidden"
    >
      {/* Background decoration */}
      <GlowOrb
        color="primary"
        size={400}
        className="top-0 right-0 -translate-y-1/2 translate-x-1/2"
      />

      <Container>
        <SectionHeading label="OPEN SOURCE" title="GitHub Activity" />

        <StatsRow />
        <ContributionGrid />
        <AchievementBadges />
      </Container>
    </section>
  )
}
