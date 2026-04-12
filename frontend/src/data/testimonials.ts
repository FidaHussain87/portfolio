// ─── Client Testimonials ─────────────────────────────────────────────────────

export interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  quote: string
  avatar: string
  rating: number // 1-5
  platform?: string
}

export const testimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Thomas Richter',
    role: 'Team Lead, DevOps',
    company: 'SAP',
    quote:
      'Fida played a key role in our GMP multi-cloud platform initiative. He took ownership of the CI/CD pipeline redesign across Azure and GCP, cutting deployment times significantly. What impressed me most was how he bridged the gap between infrastructure and development teams — he writes Terraform modules as confidently as he debugs Kubernetes manifests. A dependable engineer who raises the bar for the whole team.',
    avatar: '',
    rating: 5,
    platform: 'LinkedIn',
  },
  {
    id: 'test-2',
    name: 'Laura Stevens',
    role: 'Project Manager',
    company: 'SBTi',
    quote:
      'Fida was instrumental in rebuilding our public-facing climate platform with React and Craft CMS. He delivered complex form workflows for corporate target validation and optimized page performance for data-heavy dashboards. He consistently met sprint deadlines, communicated blockers early, and his code reviews were thorough. The platform now serves thousands of companies tracking their emission reduction targets.',
    avatar: '',
    rating: 5,
    platform: 'LinkedIn',
  },
  {
    id: 'test-3',
    name: 'Adeel Khan',
    role: 'Senior Developer',
    company: 'Systems Limited',
    quote:
      'I worked alongside Fida on the Cargo Rostering System for a major port terminal client. He built out the real-time data visualization layer with ApexCharts and agGrid, handling thousands of live data points without a hitch. He also drove our TDD approach — we hit 75% code coverage largely thanks to his discipline around writing tests before features. Solid engineer who delivers production-ready code.',
    avatar: '',
    rating: 5,
  },
  {
    id: 'test-4',
    name: 'Hammad Siddiqui',
    role: 'Tech Lead',
    company: 'AiTechSolutions',
    quote:
      'Fida built our B2C appointment booking platform from the ground up — React frontend, Node.js backend, Docker deployment on AWS. He designed over 25 REST API endpoints and implemented authentication, email verification, and image uploads. What stood out was his attention to reusability; the component library he created saved us weeks on subsequent projects. He writes clean, well-documented code that other developers can actually maintain.',
    avatar: '',
    rating: 5,
  },
] as const satisfies Testimonial[]
