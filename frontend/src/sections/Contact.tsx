import { useRef, useEffect, useState, useCallback, type FormEvent } from 'react'
import { cn } from '@utils/cn'
import { gsap } from '@utils/gsap-register'
import { Container } from '@components/layout'
import {
  SectionHeading,
  Card,
  Button,
  MagneticWrapper,
  GlowOrb,
  ParallaxLayer,
} from '@components/ui'
import { personalInfo } from '@data/index'
import {
  Mail, MapPin, Send, Loader2, AlertCircle, RotateCcw,
  Bold, Italic, Underline, Strikethrough, Type, Palette, Smile,
} from 'lucide-react'
import emailjs from '@emailjs/browser'
import { useTheme } from '@design-system/theme'

// ─── Inline SVG Brand Icons ─────────────────────────────────────────────────

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  )
}

function TwitterIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )
}

// ─── Social Icon Map ─────────────────────────────────────────────────────────

type IconComponent = React.ComponentType<{ size?: number }>

const SOCIAL_ICON_MAP: Record<string, IconComponent> = {
  GitHub: GithubIcon,
  LinkedIn: LinkedinIcon,
  Twitter: TwitterIcon,
}

// ─── Notched Border Path Builder ─────────────────────────────────────────────

// Builds a rounded-rect SVG path with an optional notch (gap) on the top edge
// for the floating label. The path starts after the notch gap (right side of
// label) and draws clockwise, ending just before the gap (left side of label).
// This lets the stroke-dashoffset animation draw from right-of-label all the
// way around and stop at left-of-label, never crossing the label text.
function buildNotchedPath(
  w: number,
  h: number,
  r: number,
  notch?: { left: number; right: number },
): string {
  if (!notch) {
    // Full rounded rect — start at top-left after radius, go clockwise
    return [
      `M ${r},0.5`,
      `H ${w - r}`,
      `A ${r},${r} 0 0 1 ${w},${r + 0.5}`,
      `V ${h - r}`,
      `A ${r},${r} 0 0 1 ${w - r},${h}`,
      `H ${r}`,
      `A ${r},${r} 0 0 1 0.5,${h - r}`,
      `V ${r + 0.5}`,
      `A ${r},${r} 0 0 1 ${r},0.5`,
      'Z',
    ].join(' ')
  }

  // With notch: start just after the gap's right edge, draw clockwise around
  // the entire rect, and end just before the gap's left edge. The gap on the
  // top edge between left and right is never stroked.
  const gapL = Math.max(notch.left, r) // don't cut into the corner radius
  const gapR = Math.min(notch.right, w - r)

  return [
    `M ${gapR},0.5`,           // start at right edge of gap
    `H ${w - r}`,              // top edge → right
    `A ${r},${r} 0 0 1 ${w},${r + 0.5}`, // top-right corner
    `V ${h - r}`,              // right edge ↓
    `A ${r},${r} 0 0 1 ${w - r},${h}`,   // bottom-right corner
    `H ${r}`,                  // bottom edge ← left
    `A ${r},${r} 0 0 1 0.5,${h - r}`,    // bottom-left corner
    `V ${r + 0.5}`,            // left edge ↑
    `A ${r},${r} 0 0 1 ${r},0.5`,        // top-left corner
    `H ${gapL}`,               // top edge → stop at left edge of gap
  ].join(' ')
}

// ─── Floating Label Input with Border Draw ──────────────────────────────────

interface FloatingInputProps {
  name: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function FloatingInput({
  name,
  label,
  type = 'text',
  value,
  onChange,
  error,
}: FloatingInputProps) {
  const [focused, setFocused] = useState(false)
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLLabelElement>(null)
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 })
  const [labelWidth, setLabelWidth] = useState(0)
  const isActive = focused || value.length > 0
  const R = 12 // border-radius matches rounded-xl
  const LABEL_LEFT = 12 // px from left edge where label sits (left-3 = 12px)
  const LABEL_PAD = 6 // extra breathing room each side

  // Measure container + label
  useEffect(() => {
    const container = containerRef.current
    const lbl = labelRef.current
    if (!container) return

    const ro = new ResizeObserver(() => {
      setSvgSize({ w: container.offsetWidth, h: container.offsetHeight })
      if (lbl) setLabelWidth(lbl.offsetWidth)
    })
    ro.observe(container)
    if (lbl) ro.observe(lbl)
    return () => ro.disconnect()
  }, [])

  // Build the correct path and animate with DrawSVG
  useEffect(() => {
    const path = pathRef.current
    if (!path || svgSize.w === 0) return

    const notch = isActive
      ? { left: LABEL_LEFT - LABEL_PAD, right: LABEL_LEFT + labelWidth + LABEL_PAD }
      : undefined

    const d = buildNotchedPath(svgSize.w - 1, svgSize.h - 0.5, R, notch)
    path.setAttribute('d', d)

    gsap.set(path, { drawSVG: '0%' })

    if (focused) {
      gsap.to(path, { drawSVG: '100%', duration: 0.6, ease: 'power2.out' })
    } else if (value.length > 0) {
      gsap.to(path, { drawSVG: '25%', duration: 0.4, ease: 'power2.in' })
    } else {
      gsap.to(path, { drawSVG: '0%', duration: 0.4, ease: 'power2.in' })
    }
  }, [focused, value.length, isActive, svgSize, labelWidth])

  return (
    <div ref={containerRef} className="relative">
      {/* SVG border draw overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-xl overflow-visible"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--color-primary-500)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Glow behind focused input */}
      {focused && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{ boxShadow: '0 0 25px rgba(0,229,219,0.08)' }}
        />
      )}

      <input
        id={name}
        name={name}
        type={type}
        className={cn(
          'peer w-full',
          'bg-[var(--glass-bg)] rounded-xl',
          'border border-[var(--border-default)]',
          'text-[var(--text-primary)] text-base',
          'pt-5 pb-2 px-4',
          'outline-none transition-all duration-300',
          'focus:bg-[var(--glass-bg-medium)]',
          'placeholder-transparent relative z-[1]',
          isActive && 'border-t-transparent focus:border-t-transparent'
        )}
        placeholder={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />

      {/* Filled indicator */}
      {!focused && value.length > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl z-20"
          style={{ background: 'var(--color-primary-500)' }}
        />
      )}

      <label
        ref={labelRef}
        htmlFor={name}
        className={cn(
          'absolute transition-all duration-300 pointer-events-none z-20',
          isActive
            ? 'top-0 left-3 -translate-y-1/2 text-[11px] text-primary-400 px-1.5'
            : 'top-1/2 left-4 -translate-y-1/2 text-base text-[var(--text-tertiary)]'
        )}
      >
        {label}
      </label>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 pl-1">{error}</p>
      )}
    </div>
  )
}

// ─── Rich Text Editor ────────────────────────────────────────────────────────

const FONT_SIZES = ['12px', '14px', '16px', '18px', '22px']
const EDITOR_COLORS = ['#ffffff', '#00e5db', '#6200e5', '#e50057', '#ff4d94', '#1afff4', '#fbbf24', '#34d399']

interface RichTextEditorProps {
  label: string
  onHtmlChange: (html: string) => void
  error?: string
}

function RichTextEditor({ label, onHtmlChange, error }: RichTextEditorProps) {
  const [focused, setFocused] = useState(false)
  const [hasContent, setHasContent] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showSizePicker, setShowSizePicker] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const editorRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLLabelElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const sizePickerRef = useRef<HTMLDivElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 })
  const [labelWidth, setLabelWidth] = useState(0)

  const isActive = focused || hasContent
  const R = 12
  const LABEL_LEFT = 12
  const LABEL_PAD = 6

  const EMOJI_LIST = [
    '😊', '😂', '🙏', '👋', '👍', '🎉', '🚀', '💡',
    '✨', '🔥', '💻', '📧', '⭐', '❤️', '🤝', '📌',
  ]

  // Measure wrapper + label
  useEffect(() => {
    const wrapper = wrapperRef.current
    const lbl = labelRef.current
    if (!wrapper) return

    const ro = new ResizeObserver(() => {
      setSvgSize({ w: wrapper.offsetWidth, h: wrapper.offsetHeight })
      if (lbl) setLabelWidth(lbl.offsetWidth)
    })
    ro.observe(wrapper)
    if (lbl) ro.observe(lbl)
    return () => ro.disconnect()
  }, [])

  // Build notched path and animate with DrawSVG
  useEffect(() => {
    const path = pathRef.current
    if (!path || svgSize.w === 0) return

    const notch = isActive
      ? { left: LABEL_LEFT - LABEL_PAD, right: LABEL_LEFT + labelWidth + LABEL_PAD }
      : undefined

    const d = buildNotchedPath(svgSize.w - 1, svgSize.h - 0.5, R, notch)
    path.setAttribute('d', d)

    gsap.set(path, { drawSVG: '0%' })

    if (focused) {
      gsap.to(path, { drawSVG: '100%', duration: 0.6, ease: 'power2.out' })
    } else if (hasContent) {
      gsap.to(path, { drawSVG: '25%', duration: 0.4, ease: 'power2.in' })
    } else {
      gsap.to(path, { drawSVG: '0%', duration: 0.4, ease: 'power2.in' })
    }
  }, [focused, hasContent, isActive, svgSize, labelWidth])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
      if (sizePickerRef.current && !sizePickerRef.current.contains(e.target as Node)) {
        setShowSizePicker(false)
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const execCmd = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    syncContent()
  }

  const syncContent = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      const text = editorRef.current.textContent || ''
      setHasContent(text.trim().length > 0)
      onHtmlChange(text.trim().length > 0 ? html : '')
    }
  }

  const toolbarBtnClass = cn(
    'p-1.5 rounded-md transition-colors duration-200',
    'text-[var(--text-tertiary)] hover:text-primary-400',
    'hover:bg-[var(--glass-bg-medium)]'
  )

  return (
    <div ref={wrapperRef} className="relative">
      {/* SVG border draw overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10 rounded-xl overflow-visible"
      >
        <path
          ref={pathRef}
          fill="none"
          stroke="var(--color-primary-500)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Glow behind focused editor */}
      {focused && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none z-0"
          style={{ boxShadow: '0 0 25px rgba(0,229,219,0.08)' }}
        />
      )}

      <div
        className={cn(
          'rounded-xl border relative z-[1] transition-all duration-300',
          focused
            ? 'bg-[var(--glass-bg-medium)] border-[var(--border-default)]'
            : 'border-[var(--border-default)] bg-[var(--glass-bg)]',
          isActive && 'border-t-transparent'
        )}
      >
        {/* Toolbar */}
        <div
          className={cn(
            'flex items-center gap-0.5 px-3 py-2 border-b transition-colors duration-300',
            focused ? 'border-primary-500/20' : 'border-[var(--border-default)]'
          )}
        >
          <button type="button" className={toolbarBtnClass} onMouseDown={(e) => { e.preventDefault(); execCmd('bold') }} title="Bold">
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button type="button" className={toolbarBtnClass} onMouseDown={(e) => { e.preventDefault(); execCmd('italic') }} title="Italic">
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button type="button" className={toolbarBtnClass} onMouseDown={(e) => { e.preventDefault(); execCmd('underline') }} title="Underline">
            <Underline className="w-3.5 h-3.5" />
          </button>
          <button type="button" className={toolbarBtnClass} onMouseDown={(e) => { e.preventDefault(); execCmd('strikeThrough') }} title="Strikethrough">
            <Strikethrough className="w-3.5 h-3.5" />
          </button>

          <div className="w-px h-4 bg-[var(--border-default)] mx-1" />

          {/* Font size picker */}
          <div className="relative" ref={sizePickerRef}>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => { e.preventDefault(); setShowSizePicker(!showSizePicker); setShowColorPicker(false); setShowEmojiPicker(false) }}
              title="Font Size"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            {showSizePicker && (
              <div className="absolute top-full left-0 mt-1 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg shadow-lg z-50 py-1 min-w-[80px]">
                {FONT_SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    className="block w-full text-left px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-primary-400 hover:bg-[var(--glass-bg)] transition-colors"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      execCmd('fontSize', '7')
                      // execCommand fontSize only supports 1-7, so we override with inline style
                      const selection = window.getSelection()
                      if (selection && selection.rangeCount > 0) {
                        const range = selection.getRangeAt(0)
                        const parent = range.commonAncestorContainer.parentElement
                        if (parent && parent.tagName === 'FONT') {
                          parent.removeAttribute('size')
                          parent.style.fontSize = size
                        }
                      }
                      setShowSizePicker(false)
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Color picker */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => { e.preventDefault(); setShowColorPicker(!showColorPicker); setShowSizePicker(false); setShowEmojiPicker(false) }}
              title="Text Color"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl shadow-lg z-50 p-3 grid grid-cols-4 gap-2.5">
                {EDITOR_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded-full border-2 border-[var(--border-default)] hover:scale-115 hover:border-primary-500/50 transition-all duration-200"
                    style={{ background: color }}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      execCmd('foreColor', color)
                      setShowColorPicker(false)
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-px h-4 bg-[var(--border-default)] mx-1" />

          {/* Emoji picker */}
          <div className="relative" ref={emojiPickerRef}>
            <button
              type="button"
              className={toolbarBtnClass}
              onMouseDown={(e) => { e.preventDefault(); setShowEmojiPicker(!showEmojiPicker); setShowColorPicker(false); setShowSizePicker(false) }}
              title="Emoji"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
            {showEmojiPicker && (
              <div className="absolute top-full right-0 mt-2 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl shadow-lg z-50 p-3 grid grid-cols-4 gap-1">
                {EMOJI_LIST.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-[var(--glass-bg-medium)] transition-colors text-xl"
                    onMouseDown={(e) => {
                      e.preventDefault()
                      execCmd('insertText', emoji)
                      setShowEmojiPicker(false)
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editable area */}
        <div
          ref={editorRef}
          contentEditable
          className={cn(
            'w-full min-h-[120px] max-h-[200px] overflow-y-auto scrollbar-none',
            'text-[var(--text-primary)] text-base',
            'px-4 pt-5 pb-3',
            'outline-none',
            '[&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-[var(--text-tertiary)] [&:empty]:before:pointer-events-none'
          )}
          data-placeholder=""
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onInput={syncContent}
          onPaste={(e) => {
            e.preventDefault()
            const text = e.clipboardData.getData('text/plain')
            document.execCommand('insertText', false, text)
          }}
        />
      </div>

      {/* Filled indicator */}
      {!focused && hasContent && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl z-20"
          style={{ background: 'var(--color-primary-500)' }}
        />
      )}

      {/* Floating label */}
      <label
        ref={labelRef}
        className={cn(
          'absolute transition-all duration-300 pointer-events-none z-20',
          isActive
            ? 'top-0 left-3 -translate-y-1/2 text-[11px] text-primary-400 px-1.5'
            : 'top-[52px] left-4 text-base text-[var(--text-tertiary)]'
        )}
      >
        {label}
      </label>

      {error && (
        <p className="mt-1.5 text-xs text-red-400 pl-1">{error}</p>
      )}
    </div>
  )
}

// ─── Contact Info (Left Side) ────────────────────────────────────────────────

function ContactInfo() {
  const infoRef = useRef<HTMLDivElement>(null)
  const socialLinks = personalInfo.socialLinks.filter(
    (link: { platform: string; url: string; handle: string }) => SOCIAL_ICON_MAP[link.platform]
  )

  // ── Contact info stagger + social hover ──
  useEffect(() => {
    const el = infoRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Contact info items stagger
      const infoItems = el.querySelectorAll('[data-contact-item]')
      if (infoItems.length) {
        gsap.from(infoItems, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          stagger: 0.12,
          delay: 0.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }

      // Social link hover glow
      if (!window.matchMedia('(hover: none)').matches) {
        const socialBtns = el.querySelectorAll<HTMLElement>('[data-social-link]')
        socialBtns.forEach((btn) => {
          btn.addEventListener('mouseenter', () => {
            gsap.to(btn, {
              boxShadow: '0 0 20px rgba(0,229,219,0.3)',
              scale: 1.1,
              duration: 0.3,
              ease: 'power2.out',
            })
          })
          btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
              boxShadow: '0 0 0px rgba(0,0,0,0)',
              scale: 1,
              duration: 0.35,
              ease: 'power3.out',
            })
          })
        })
      }
    }, el)

    return () => { ctx.revert() }
  }, [])

  return (
    <div ref={infoRef} className="flex flex-col gap-8">
      <div>
        <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gradient leading-tight mb-3 sm:mb-4">
          Let&apos;s Work Together
        </h3>
        <p className="text-[var(--text-secondary)] text-base sm:text-lg md:text-xl leading-relaxed max-w-lg">
          I&apos;m always open to discussing new projects, creative ideas, or
          opportunities to be part of your vision. Let&apos;s build something
          exceptional together.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <a
          data-contact-item
          href={`mailto:${personalInfo.email}`}
          className="flex items-center gap-3 text-[var(--text-secondary)] hover:text-primary-400 transition-colors group"
        >
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              'bg-[var(--glass-bg)] border border-[var(--glass-border)]',
              'group-hover:border-primary-500/30 transition-colors'
            )}
          >
            <Mail className="w-4 h-4" />
          </div>
          <span className="text-sm">{personalInfo.email}</span>
        </a>

        <div data-contact-item className="flex items-center gap-3 text-[var(--text-secondary)]">
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center',
              'bg-[var(--glass-bg)] border border-[var(--glass-border)]'
            )}
          >
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-sm">
            {personalInfo.location.city}, {personalInfo.location.country}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {socialLinks
          .filter((link: { platform: string; url: string; handle: string }) => link.platform !== 'Email')
          .map((link: { platform: string; url: string; handle: string }) => {
            const Icon = SOCIAL_ICON_MAP[link.platform]
            if (!Icon) return null

            return (
              <MagneticWrapper key={link.platform} strength={0.4}>
                <a
                  data-social-link
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.platform}
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center will-change-transform',
                    'bg-[var(--glass-bg)] border border-[var(--glass-border)]',
                    'text-[var(--text-secondary)]',
                    'hover:text-primary-400 hover:border-primary-500/30',
                    'transition-colors duration-300'
                  )}
                >
                  <Icon size={20} />
                </a>
              </MagneticWrapper>
            )
          })}
      </div>
    </div>
  )
}

// ─── Confetti Burst ──────────────────────────────────────────────────────────

function spawnConfetti(container: HTMLElement) {
  const colors = ['#00e5db', '#6200e5', '#e50057', '#1afff4', '#ff4d94']

  for (let i = 0; i < 30; i++) {
    const dot = document.createElement('div')
    dot.style.position = 'absolute'
    dot.style.width = `${4 + Math.random() * 6}px`
    dot.style.height = `${4 + Math.random() * 6}px`
    dot.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px'
    dot.style.background = colors[Math.floor(Math.random() * colors.length)]
    dot.style.left = '50%'
    dot.style.top = '50%'
    dot.style.pointerEvents = 'none'
    dot.style.zIndex = '50'
    container.appendChild(dot)

    const angle = Math.random() * Math.PI * 2
    const distance = 80 + Math.random() * 120
    const duration = 0.6 + Math.random() * 0.4

    gsap.to(dot, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance - 40,
      opacity: 0,
      rotation: Math.random() * 360,
      duration,
      ease: 'power2.out',
      onComplete: () => dot.remove(),
    })
  }
}

// ─── Contact Form (Right Side) ──────────────────────────────────────────────

// Theme-specific color maps for the email template
const EMAIL_THEME_VARS = {
  dark: {
    bg_outer: '#0a0a0f',
    bg_main: '#0d0d14',
    bg_header: '#111118',
    bg_footer: '#08080d',
    bg_card: 'rgba(0,229,219,0.04)',
    bg_message: 'rgba(98,0,229,0.04)',
    text_primary: '#f0f1f5',
    text_secondary: '#b3b9cc',
    text_body: 'rgba(255,255,255,0.85)',
    border_main: 'rgba(0,229,219,0.1)',
    border_footer: 'rgba(0,229,219,0.06)',
    border_card: 'rgba(0,229,219,0.1)',
    border_message: 'rgba(98,0,229,0.4)',
    label_color: 'rgba(0,229,219,0.5)',
    grid_color: 'rgba(0,229,219,0.03)',
    divider: 'rgba(0,229,219,0.2)',
    scanline: 'rgba(0,229,219,0.15)',
    scanline_dot: 'rgba(0,229,219,0.3)',
    footer_subtle: 'rgba(255,255,255,0.2)',
    btn_text: '#0a0a0f',
  },
  light: {
    bg_outer: '#f0f1f5',
    bg_main: '#fafbff',
    bg_header: '#ffffff',
    bg_footer: '#e4e6ef',
    bg_card: 'rgba(0,229,219,0.06)',
    bg_message: 'rgba(98,0,229,0.04)',
    text_primary: '#0d101a',
    text_secondary: '#3a4366',
    text_body: '#1a1f33',
    border_main: 'rgba(13,16,26,0.1)',
    border_footer: 'rgba(13,16,26,0.06)',
    border_card: 'rgba(0,229,219,0.15)',
    border_message: 'rgba(98,0,229,0.3)',
    label_color: 'rgba(0,180,170,0.7)',
    grid_color: 'rgba(0,229,219,0.05)',
    divider: 'rgba(0,229,219,0.25)',
    scanline: 'rgba(0,229,219,0.2)',
    scanline_dot: 'rgba(0,229,219,0.4)',
    footer_subtle: 'rgba(13,16,26,0.3)',
    btn_text: '#0a0a0f',
  },
} as const

function ContactForm() {
  const { theme } = useTheme()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Partial<Record<keyof typeof formData, string>>>({})
  const formRef = useRef<HTMLDivElement>(null)
  const formCardRef = useRef<HTMLDivElement>(null)
  const successRef = useRef<HTMLDivElement>(null)
  const checkRef = useRef<SVGCircleElement>(null)
  const checkPathRef = useRef<SVGPathElement>(null)

  // ── Form field stagger entrance ──
  useEffect(() => {
    const card = formCardRef.current
    if (!card) return

    const ctx = gsap.context(() => {
      const fields = card.querySelectorAll('[data-form-field]')
      if (fields.length) {
        gsap.from(fields, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          stagger: 0.1,
          delay: 0.3,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    }, card)

    return () => { ctx.revert() }
  }, [])

  const validate = useCallback(() => {
    const newErrors: Partial<Record<keyof typeof formData, string>> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required'
    if (!formData.message.trim()) newErrors.message = 'Message is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const shakeForm = useCallback(() => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        keyframes: [
          { x: -10, duration: 0.07 },
          { x: 10, duration: 0.07 },
          { x: -8, duration: 0.07 },
          { x: 8, duration: 0.07 },
          { x: -4, duration: 0.07 },
          { x: 4, duration: 0.07 },
          { x: 0, duration: 0.07 },
        ],
        ease: 'power2.out',
      })
    }
  }, [])

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault()
    if (status === 'sending' || status === 'success') return

    if (!validate()) {
      shakeForm()
      return
    }

    setStatus('sending')

    try {
      const themeVars = EMAIL_THEME_VARS[theme]
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
          to_email: 'fidahussain.sw31@gmail.com',
          ...themeVars,
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      )

      setStatus('success')

      // Animate form out
      if (formRef.current) {
        gsap.to(formRef.current, {
          scale: 0.95,
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            if (formRef.current) formRef.current.style.display = 'none'

            // Show success
            if (successRef.current) {
              successRef.current.style.display = 'flex'
              gsap.fromTo(successRef.current,
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' }
              )

              // Stroke-draw checkmark with DrawSVG
              if (checkPathRef.current) {
                gsap.fromTo(checkPathRef.current,
                  { drawSVG: '0%' },
                  { drawSVG: '100%', duration: 0.6, delay: 0.2, ease: 'power2.out' }
                )
              }

              if (checkRef.current) {
                gsap.fromTo(checkRef.current,
                  { drawSVG: '0%' },
                  { drawSVG: '100%', duration: 0.8, ease: 'power2.out' }
                )
              }

              // Confetti
              spawnConfetti(successRef.current)
            }
          },
        })
      }
    } catch {
      setStatus('error')
      shakeForm()
    }
  }, [status, formData, validate, shakeForm])

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card ref={formCardRef} className="p-6 sm:p-8 lg:p-10 relative overflow-hidden">
      <div ref={formRef}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
          <div data-form-field>
            <FloatingInput
              name="name"
              label="Your Name"
              value={formData.name}
              onChange={updateField('name')}
              error={errors.name}
            />
          </div>
          <div data-form-field>
            <FloatingInput
              name="email"
              label="Your Email"
              type="email"
              value={formData.email}
              onChange={updateField('email')}
              error={errors.email}
            />
          </div>
          <div data-form-field>
            <FloatingInput
              name="subject"
              label="Subject"
              value={formData.subject}
              onChange={updateField('subject')}
              error={errors.subject}
            />
          </div>
          <div data-form-field>
            <RichTextEditor
              label="Your Message"
              onHtmlChange={(html) => setFormData((prev) => ({ ...prev, message: html }))}
              error={errors.message}
            />
          </div>

          <div className="pt-2" data-cursor-text="Send">
            <MagneticWrapper strength={0.2}>
              <Button
                variant="primary"
                size="lg"
                type="submit"
                disabled={status === 'sending' || status === 'success'}
              >
                {status === 'sending' ? (
                  <>
                    Sending...
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </Button>
            </MagneticWrapper>
          </div>

          {/* Error state */}
          {status === 'error' && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-sm text-red-300 flex-1">
                Failed to send message. Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors shrink-0"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Retry
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Success state */}
      <div
        ref={successRef}
        className="hidden flex-col items-center justify-center py-16 relative"
        style={{ display: 'none' }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" className="mb-6">
          <circle
            ref={checkRef}
            cx="40"
            cy="40"
            r="36"
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth="3"
          />
          <path
            ref={checkPathRef}
            d="M 24,42 L 34,52 L 56,28"
            fill="none"
            stroke="var(--color-primary-500)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <h4 className="text-2xl font-heading font-bold text-[var(--text-primary)] mb-2">
          Message Sent!
        </h4>
        <p className="text-[var(--text-secondary)] text-center max-w-xs">
          Thank you for reaching out. I&apos;ll get back to you as soon as possible.
        </p>
      </div>
    </Card>
  )
}

// ─── Contact Section ─────────────────────────────────────────────────────────

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // ── Enhanced entrance with blur ──
  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      const children = content.children
      if (children.length >= 2) {
        gsap.from(children[0], {
          x: -100,
          opacity: 0,
          filter: prefersReduced ? 'none' : 'blur(8px)',
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
        gsap.from(children[1], {
          x: 100,
          opacity: 0,
          filter: prefersReduced ? 'none' : 'blur(8px)',
          duration: 1,
          delay: 0.15,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: content,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })
      }
    }, section)

    return () => { ctx.revert() }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="section-padding relative overflow-hidden"
    >
      {/* Background decorations with parallax */}
      <ParallaxLayer speed={-0.15}>
        <GlowOrb
          color="secondary"
          size={350}
          className="bottom-0 left-0 translate-y-1/3 -translate-x-1/3"
        />
      </ParallaxLayer>
      <ParallaxLayer speed={0.1}>
        <GlowOrb
          color="primary"
          size={250}
          className="top-1/4 right-0 translate-x-1/2"
        />
      </ParallaxLayer>

      <Container>
        <SectionHeading label="GET IN TOUCH" title="Contact Me" />

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 lg:gap-20 items-start">
          {/* Left: contact info */}
          <div>
            <ContactInfo />
          </div>

          {/* Right: contact form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </Container>
    </section>
  )
}
