// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  sectionId: string
}

export const navigation: NavItem[] = [
  { label: 'Home', href: '#home', sectionId: 'home' },
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Skills', href: '#skills', sectionId: 'skills' },
  { label: 'Experience', href: '#experience', sectionId: 'experience' },
  { label: 'Projects', href: '#projects', sectionId: 'projects' },
  { label: 'Services', href: '#services', sectionId: 'services' },
  { label: 'Testimonials', href: '#testimonials', sectionId: 'testimonials' },
  { label: 'GitHub', href: '#github', sectionId: 'github' },
  { label: 'Contact', href: '#contact', sectionId: 'contact' },
] as const satisfies NavItem[]
