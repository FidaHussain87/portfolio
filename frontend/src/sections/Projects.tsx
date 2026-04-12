import { useState, useRef, useEffect, useCallback, type MouseEvent } from 'react'
import { gsap, Flip, SplitText } from '@utils/gsap-register'
import { cn } from '@utils/cn'
import { Container } from '@components/layout'
import { SectionHeading, Card, Badge, GlowOrb, ParallaxLayer } from '@components/ui'
import { projects, projectCategories } from '@data/index'
import type { Project } from '@data/index'
import { useSectionEntrance } from '@hooks/useSectionEntrance'
import { ExternalLink, GitFork } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

type CategoryId = (typeof projectCategories)[number]['id']

// ─── Gradient palette per category for placeholder images ────────────────────

const categoryGradients: Record<string, string> = {
  fullstack: 'from-primary-500/60 via-secondary-500/40 to-accent-500/30',
  ai: 'from-secondary-500/60 via-accent-500/40 to-primary-500/30',
  cloud: 'from-primary-500/50 via-primary-300/30 to-secondary-500/40',
  iot: 'from-accent-500/50 via-primary-500/30 to-secondary-500/40',
}

// ─── Featured Project Card (Full-Width Cinematic) ────────────────────────────

function FeaturedProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const gradient = categoryGradients[project.category] ?? categoryGradients.fullstack
  const number = String(index + 1).padStart(2, '0')

  useEffect(() => {
    const card = cardRef.current
    const image = imageRef.current
    const num = numberRef.current
    if (!card || !image) return

    let cancelled = false
    let ctx: gsap.Context | null = null
    let titleSplit: InstanceType<typeof SplitText> | null = null

    document.fonts.ready.then(() => {
      if (cancelled) return

      // SplitText for title characters
      const titleEl = card.querySelector('.featured-title') as HTMLElement | null
      if (titleEl) {
        titleSplit = new SplitText(titleEl, { type: 'chars' })
      }

      ctx = gsap.context(() => {
        // Image clipPath reveal (wipe left-to-right) + scanline sweep
        const revealTl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        })

        revealTl.fromTo(image,
          { clipPath: 'inset(0 100% 0 0)' },
          {
            clipPath: 'inset(0 0% 0 0)',
            duration: 1.2,
            ease: 'power3.inOut',
          }
        )

        // Scanline sweep concurrent with image wipe
        const scanline = card.querySelector('[data-scanline]')
        if (scanline) {
          revealTl.fromTo(scanline,
            { left: '0%', opacity: 1 },
            {
              left: '100%',
              opacity: 0.6,
              duration: 1.2,
              ease: 'power3.inOut',
            },
            0 // start at the same time as the wipe
          )
        }

        // Ghost number parallax
        if (num) {
          gsap.to(num, {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          })
        }

        // Title character animation using SplitText
        if (titleSplit) {
          gsap.from(titleSplit.chars, {
            y: 60,
            opacity: 0,
            rotateX: 45,
            duration: 0.7,
            stagger: 0.03,
            ease: 'power3.out',
            transformPerspective: 600,
            scrollTrigger: {
              trigger: card,
              start: 'top 70%',
              toggleActions: 'play none none none',
            },
          })
        }

        // Tech badges stagger
        const badges = card.querySelectorAll('.featured-badge')
        if (badges.length) {
          gsap.from(badges, {
            y: 20,
            opacity: 0,
            duration: 0.4,
            stagger: 0.05,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 65%',
              toggleActions: 'play none none none',
            },
          })
        }
      }, card)
    }) // end document.fonts.ready

    return () => {
      cancelled = true
      ctx?.revert()
      titleSplit?.revert()
    }
  }, [])

  return (
    <div
      ref={cardRef}
      className="featured-project relative mb-10 sm:mb-16 lg:mb-24"
      data-cursor-text="View"
    >
      {/* Ghost number */}
      <span
        ref={numberRef}
        className={cn(
          'absolute -top-4 sm:-top-8 lg:-top-12 left-2 sm:left-4 lg:left-8',
          'text-[4rem] sm:text-[6rem] md:text-[8rem] lg:text-[12rem] font-heading font-bold leading-none',
          'text-[var(--text-primary)] opacity-[0.03] select-none pointer-events-none',
          'z-0'
        )}
        aria-hidden="true"
      >
        {number}
      </span>

      <Card className="relative overflow-hidden z-10" hover={false}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Image area */}
          <div
            ref={imageRef}
            className="relative aspect-video lg:aspect-auto lg:min-h-[400px] overflow-hidden"
          >
            <div
              className={cn(
                'absolute inset-0 bg-gradient-to-br',
                gradient,
                'flex items-center justify-center'
              )}
            >
              <span className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold text-white/8 select-none text-center leading-tight px-6 break-words">
                {project.title}
              </span>
            </div>
            {/* Scanline sweep */}
            <div
              data-scanline
              className="absolute top-0 bottom-0 w-[2px] pointer-events-none z-10"
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(0,229,219,0.8), transparent)',
                boxShadow: '0 0 12px rgba(0,229,219,0.5), 0 0 24px rgba(0,229,219,0.2)',
                left: '0%',
                opacity: 0,
              }}
            />
          </div>

          {/* Content */}
          <div className="p-5 sm:p-8 lg:p-12 flex flex-col justify-center">
            <h3 className="featured-title text-2xl sm:text-3xl lg:text-4xl font-heading font-bold text-[var(--text-primary)] mb-3 sm:mb-4">
              {project.title}
            </h3>
            <p className="text-sm sm:text-base lg:text-lg text-[var(--text-secondary)] leading-relaxed mb-4 sm:mb-6">
              {project.longDescription}
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
              {project.techStack.map((tech: string) => (
                <Badge key={tech} variant="primary" className="featured-badge">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg',
                    'bg-[var(--glass-bg)] border border-[var(--glass-border)]',
                    'text-[var(--text-secondary)] hover:text-primary-400 hover:border-primary-500/30',
                    'transition-colors duration-200 text-sm'
                  )}
                >
                  <GitFork className="w-4 h-4" /> Code
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-4 py-2 rounded-lg',
                    'bg-primary-500/15 border border-primary-500/25',
                    'text-primary-400 hover:bg-primary-500/25',
                    'transition-colors duration-200 text-sm'
                  )}
                >
                  <ExternalLink className="w-4 h-4" /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Standard Project Card ──────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((y - centerY) / centerY) * -6
    const rotateY = ((x - centerX) / centerX) * 6

    gsap.to(cardRef.current, {
      rotateX,
      rotateY,
      duration: 0.4,
      ease: 'power2.out',
      transformPerspective: 1000,
    })
  }, [])

  const handleMouseEnter = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        boxShadow: '0 0 40px rgba(0,229,219,0.15)',
        duration: 0.4,
        ease: 'power2.out',
      })
    }
    if (!overlayRef.current) return
    gsap.to(overlayRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (cardRef.current) {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        boxShadow: '0 0 0px rgba(0,0,0,0)',
        duration: 0.6,
        ease: 'power3.out',
      })
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        y: '100%',
        opacity: 0,
        duration: 0.35,
        ease: 'power3.in',
      })
    }
  }, [])

  // Individual ScrollTrigger
  useEffect(() => {
    const card = cardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      const rotateY = index % 2 === 0 ? -5 : 5

      gsap.from(card, {
        y: 60,
        opacity: 0,
        rotateY,
        scale: 0.95,
        duration: 0.8,
        ease: 'power3.out',
        transformPerspective: 1000,
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      })
    }, card)

    return () => { ctx.revert() }
  }, [index])

  const gradient = categoryGradients[project.category] ?? categoryGradients.fullstack

  return (
    <div
      ref={cardRef}
      className="project-card will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
      data-cursor-text="View"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="overflow-hidden group" hover={false}>
        {/* Image area */}
        <div className="relative aspect-video overflow-hidden">
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-br',
              gradient,
              'flex items-center justify-center'
            )}
          >
            <span className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-white/10 select-none text-center leading-tight px-4 break-words">
              {project.title}
            </span>
          </div>

          {/* Hover overlay */}
          <div
            ref={overlayRef}
            className={cn(
              'absolute inset-0 flex flex-col justify-end p-4 sm:p-6',
              'bg-gradient-to-t from-black/90 via-black/60 to-transparent',
              'opacity-0 translate-y-full'
            )}
          >
            <h3 className="text-xl font-heading font-bold text-white mb-2">
              {project.title}
            </h3>
            <p className="text-sm text-white/70 mb-3 line-clamp-2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.slice(0, 4).map((tech: string) => (
                <span
                  key={tech}
                  className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80"
                >
                  {tech}
                </span>
              ))}
              {project.techStack.length > 4 && (
                <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/60">
                  +{project.techStack.length - 4}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                    'bg-white/10 hover:bg-white/20 text-white text-sm',
                    'transition-colors duration-200'
                  )}
                  aria-label={`View ${project.title} on GitHub`}
                >
                  <GitFork className="w-4 h-4" />
                  Code
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg',
                    'bg-primary-500/20 hover:bg-primary-500/30 text-primary-300 text-sm',
                    'transition-colors duration-200'
                  )}
                  aria-label={`View ${project.title} live demo`}
                >
                  <ExternalLink className="w-4 h-4" />
                  Live
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-4 sm:p-5 md:p-6">
          <h3 className="text-lg font-heading font-bold text-[var(--text-primary)] mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 5).map((tech: string) => (
              <Badge key={tech} variant="primary">
                {tech}
              </Badge>
            ))}
            {project.techStack.length > 5 && (
              <Badge variant="default">+{project.techStack.length - 5}</Badge>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

// ─── Filter Bar ──────────────────────────────────────────────────────────────

interface FilterBarProps {
  active: CategoryId
  onChange: (id: CategoryId) => void
}

function FilterBar({ active, onChange }: FilterBarProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const underlineRef = useRef<HTMLDivElement>(null)
  const buttonRefs = useRef<Map<string, HTMLButtonElement>>(new Map())

  const setButtonRef = useCallback(
    (id: string) => (el: HTMLButtonElement | null) => {
      if (el) {
        buttonRefs.current.set(id, el)
      } else {
        buttonRefs.current.delete(id)
      }
    },
    []
  )

  useEffect(() => {
    const activeBtn = buttonRefs.current.get(active)
    const underline = underlineRef.current
    const bar = barRef.current

    if (!activeBtn || !underline || !bar) return

    const barRect = bar.getBoundingClientRect()
    const btnRect = activeBtn.getBoundingClientRect()

    gsap.to(underline, {
      x: btnRect.left - barRect.left,
      width: btnRect.width,
      duration: 0.4,
      ease: 'power3.out',
    })
  }, [active])

  return (
    <div className="flex justify-start sm:justify-center mb-8 sm:mb-10 lg:mb-14 overflow-x-auto scrollbar-none px-1">
      <div
        ref={barRef}
        className={cn(
          'relative inline-flex items-center gap-1 p-1 sm:p-1.5 rounded-xl',
          'bg-[var(--glass-bg)] backdrop-blur-[10px]',
          'border border-[var(--glass-border)]'
        )}
      >
        <div
          ref={underlineRef}
          className={cn(
            'absolute bottom-1.5 left-0 h-[calc(100%-12px)] rounded-lg',
            'bg-primary-500/15 border border-primary-500/25',
            'pointer-events-none'
          )}
          style={{ width: 0 }}
        />

        {projectCategories.map((cat) => (
          <button
            key={cat.id}
            ref={setButtonRef(cat.id)}
            type="button"
            onClick={() => onChange(cat.id)}
            className={cn(
              'relative z-10 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium',
              'transition-colors duration-200',
              active === cat.id
                ? 'text-primary-400'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Projects Section ────────────────────────────────────────────────────────

export function Projects() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const sectionRef = useSectionEntrance<HTMLElement>('fadeBlur')
  const gridRef = useRef<HTMLDivElement>(null)
  const isAnimating = useRef(false)
  const flipStateRef = useRef<Flip.FlipState | null>(null)

  const filteredProjects =
    activeCategory === 'all'
      ? projects
      : projects.filter((p: Project) => p.category === activeCategory)

  // Split into featured and regular
  const featuredProjects = filteredProjects.filter((p: Project) => p.featured)
  const regularProjects = filteredProjects.filter((p: Project) => !p.featured)

  // Category change animation
  const handleCategoryChange = useCallback(
    (newCategory: CategoryId) => {
      if (newCategory === activeCategory || isAnimating.current) return

      const grid = gridRef.current
      if (!grid) {
        setActiveCategory(newCategory)
        return
      }

      // Capture current card positions before state change
      const currentCards = grid.querySelectorAll('.project-card, .featured-project')
      if (currentCards.length > 0) {
        flipStateRef.current = Flip.getState(currentCards)
      }

      setActiveCategory(newCategory)
    },
    [activeCategory]
  )

  // Animate in new cards after state update using Flip
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return

    const cards = grid.querySelectorAll('.project-card, .featured-project')
    if (cards.length === 0) return

    const savedState = flipStateRef.current

    if (savedState) {
      Flip.from(savedState, {
        targets: cards,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.04,
        absolute: true,
        onEnter: (elements) =>
          gsap.fromTo(
            elements,
            { opacity: 0, scale: 0.9, y: 30 },
            { opacity: 1, scale: 1, y: 0, duration: 0.5 }
          ),
        onLeave: (elements) =>
          gsap.to(elements, { opacity: 0, scale: 0.9, duration: 0.3 }),
      })
      flipStateRef.current = null
    } else {
      // Fallback: simple fade-in if no Flip state captured
      gsap.fromTo(
        cards,
        { scale: 0.9, opacity: 0, y: 30 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.06,
          ease: 'power3.out',
          clearProps: 'all',
        }
      )
    }
  }, [activeCategory])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="section-padding relative overflow-hidden"
    >
      {/* Ambient GlowOrbs with parallax */}
      <ParallaxLayer speed={-0.2}>
        <GlowOrb
          color="accent"
          size={350}
          className="-top-40 -left-40"
        />
      </ParallaxLayer>
      <ParallaxLayer speed={0.15}>
        <GlowOrb
          color="secondary"
          size={300}
          className="-bottom-32 -right-32"
        />
      </ParallaxLayer>

      <Container className="relative z-10">
        <SectionHeading label="PORTFOLIO" title="Featured Projects" />

        <FilterBar active={activeCategory} onChange={handleCategoryChange} />

        <div ref={gridRef}>
          {/* Featured projects — full-width cinematic */}
          {featuredProjects.map((project: Project, i: number) => (
            <FeaturedProjectCard key={project.id} project={project} index={i} />
          ))}

          {/* Regular projects — 2-column grid */}
          {regularProjects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8">
              {regularProjects.map((project: Project, i: number) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </div>
          )}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[var(--text-secondary)] text-lg">
              No projects found in this category.
            </p>
          </div>
        )}
      </Container>
    </section>
  )
}
