import { useState } from 'react'
import { SmoothScroller } from '@components/layout'
import { CustomCursor, NoiseOverlay, ScrollProgress, SectionDivider } from '@components/ui'
import {
  Preloader,
  Navigation,
  Hero,
  About,
  Skills,
  Experience,
  Projects,
  Services,
  Testimonials,
  GitHubActivity,
  Contact,
  Footer,
} from '@sections/index'
export default function App() {
  const [preloaderComplete, setPreloaderComplete] = useState(false)

  return (
    <>
      {/* Skip to content link for accessibility */}
      <a href="#main-content" className="skip-to-content">
        Skip to content
      </a>

      {/* Custom cursor (hidden on mobile) */}
      <CustomCursor />

      {/* Noise texture overlay */}
      <NoiseOverlay />

      {/* Scroll progress bar */}
      {preloaderComplete && <ScrollProgress />}

      {/* Preloader */}
      {!preloaderComplete && (
        <Preloader onComplete={() => setPreloaderComplete(true)} />
      )}

      {/* Navigation */}
      <Navigation preloaderComplete={preloaderComplete} />

      {/* Main content */}
      <SmoothScroller>
        <main id="main-content">
          <Hero />
          <SectionDivider variant="wave" />
          <About />
          <SectionDivider variant="diagonal" />
          <Skills />
          <Experience />
          <SectionDivider variant="wave" flip />
          <Projects />
          <SectionDivider variant="diagonal" flip />
          <Services />
          <Testimonials />
          <SectionDivider variant="wave" />
          <GitHubActivity />
          <SectionDivider variant="diagonal" />
          <Contact />
        </main>
        <Footer />
      </SmoothScroller>
    </>
  )
}
