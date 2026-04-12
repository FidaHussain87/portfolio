import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Flip } from 'gsap/Flip'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { CustomEase } from 'gsap/CustomEase'
import { CustomBounce } from 'gsap/CustomBounce'
import { CustomWiggle } from 'gsap/CustomWiggle'
import { InertiaPlugin } from 'gsap/InertiaPlugin'

gsap.registerPlugin(
  ScrollTrigger,
  Flip,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  SplitText,
  ScrambleTextPlugin,
  CustomEase,
  CustomBounce,
  CustomWiggle,
  InertiaPlugin,
)

// ─── Custom Eases ─────────────────────────────────────────────────────────────

CustomEase.create('cyberSnap', 'M0,0 C0.12,0 0.14,0.6 0.25,0.8 0.36,1 0.56,1.05 0.62,1.03 0.68,1.01 0.75,1 1,1')
CustomEase.create('neonPulse', 'M0,0 C0.4,0 0.2,1.6 0.5,1 0.8,0.4 0.7,1 1,1')
CustomEase.create('glitchIn', 'M0,0 C0.05,0 0.1,0.85 0.15,0.85 0.2,0.85 0.2,0.15 0.25,0.95 0.3,1 0.35,1 0.5,1 0.65,1 0.7,1 1,1')
CustomBounce.create('cyberbounce', { strength: 0.4, squash: 3, endAtStart: false })
CustomWiggle.create('neonWiggle', { wiggles: 6, type: 'easeOut' })

// ─── Reusable Registered Effects ──────────────────────────────────────────────

gsap.registerEffect({
  name: 'fadeIn',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.from(targets, {
      opacity: 0,
      y: config.y ?? 30,
      duration: config.duration ?? 0.6,
      ease: config.ease ?? 'power3.out',
      stagger: config.stagger ?? 0.1,
    })
  },
  defaults: { y: 30, duration: 0.6, stagger: 0.1 },
  extendTimeline: true,
})

gsap.registerEffect({
  name: 'glowPulse',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.fromTo(targets,
      { boxShadow: '0 0 0px rgba(0,229,219,0)' },
      {
        boxShadow: config.shadow ?? '0 0 20px rgba(0,229,219,0.4)',
        duration: config.duration ?? 0.3,
        yoyo: true,
        repeat: config.repeat ?? 1,
        ease: config.ease ?? 'power2.inOut',
      }
    )
  },
  defaults: { shadow: '0 0 20px rgba(0,229,219,0.4)', duration: 0.3, repeat: 1 },
  extendTimeline: true,
})

gsap.registerEffect({
  name: 'cyberReveal',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.from(targets, {
      opacity: 0,
      scale: config.scale ?? 0.9,
      filter: `blur(${config.blur ?? 6}px)`,
      y: config.y ?? 40,
      duration: config.duration ?? 0.7,
      ease: config.ease ?? 'cyberSnap',
      stagger: config.stagger ?? 0.05,
    })
  },
  defaults: { scale: 0.9, blur: 6, y: 40, duration: 0.7, stagger: 0.05 },
  extendTimeline: true,
})

gsap.registerEffect({
  name: 'scrambleIn',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.to(targets, {
      duration: config.duration ?? 1.2,
      scrambleText: {
        text: '{original}',
        chars: config.chars ?? '█▓▒░╱╲{}[]01',
        speed: config.speed ?? 0.4,
        revealDelay: config.revealDelay ?? 0.3,
      },
    })
  },
  defaults: { duration: 1.2, chars: '█▓▒░╱╲{}[]01', speed: 0.4, revealDelay: 0.3 },
  extendTimeline: true,
})

gsap.registerEffect({
  name: 'neonBorderDraw',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.fromTo(targets,
      { drawSVG: '0%' },
      {
        drawSVG: config.drawSVG ?? '100%',
        duration: config.duration ?? 1,
        ease: config.ease ?? 'power2.out',
      }
    )
  },
  defaults: { drawSVG: '100%', duration: 1 },
  extendTimeline: true,
})

gsap.registerEffect({
  name: 'hoverLift',
  effect: (targets: gsap.TweenTarget, config: gsap.TweenVars) => {
    return gsap.to(targets, {
      y: config.y ?? -8,
      scale: config.scale ?? 1.02,
      boxShadow: config.shadow ?? '0 0 30px rgba(0,229,219,0.15)',
      duration: config.duration ?? 0.3,
      ease: config.ease ?? 'power2.out',
    })
  },
  defaults: { y: -8, scale: 1.02, duration: 0.3 },
  extendTimeline: true,
})

// ─── Defaults ─────────────────────────────────────────────────────────────────

gsap.defaults({
  ease: 'power3.out',
  duration: 0.6,
})

export {
  gsap,
  ScrollTrigger,
  Flip,
  DrawSVGPlugin,
  MorphSVGPlugin,
  MotionPathPlugin,
  SplitText,
  ScrambleTextPlugin,
  CustomEase,
  CustomBounce,
  CustomWiggle,
  InertiaPlugin,
}
