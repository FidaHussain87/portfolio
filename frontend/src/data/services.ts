// ─── Services ────────────────────────────────────────────────────────────────

export interface Service {
  id: string
  title: string
  description: string
  longDescription: string
  icon: string // lucide-react icon name
  highlights: string[]
}

export const services: Service[] = [
  {
    id: 'svc-1',
    title: 'Full Stack Web Development',
    description:
      'End-to-end web application development from pixel-perfect React frontends to scalable Node.js backend APIs and database architecture.',
    longDescription:
      'I build production-grade web applications using React, Next.js, and Redux on the frontend paired with Node.js, Express, and NestJS backends. Every project includes responsive design, robust authentication with OAuth 2.0, optimized database queries, and comprehensive test coverage with Jest. From startup MVPs to enterprise SaaS platforms, I deliver clean, maintainable code that scales.',
    icon: 'Code2',
    highlights: [
      'React, Next.js, and Redux applications',
      'RESTful and GraphQL API design',
      'Database modeling with PostgreSQL, MongoDB, MySQL',
      'Authentication and authorization (OAuth 2.0)',
      'Performance optimization and SEO',
    ],
  },
  {
    id: 'svc-2',
    title: 'Frontend Engineering',
    description:
      'Crafting responsive, accessible, and high-performance user interfaces that translate Figma designs into production-ready code.',
    longDescription:
      'I specialize in translating complex Figma designs into pixel-perfect, responsive React components with strict design system adherence. Using Tailwind CSS, Material-UI, or custom styling solutions, I build reusable component libraries, implement sophisticated animations with GSAP, and ensure cross-browser compatibility. Every interface I build prioritizes performance, accessibility, and seamless user experience.',
    icon: 'Brain',
    highlights: [
      'Figma-to-code with design system adherence',
      'Reusable component library development',
      'Advanced animations with GSAP',
      'Cross-browser compatibility',
      'Responsive and mobile-first design',
    ],
  },
  {
    id: 'svc-3',
    title: 'Cloud & DevOps',
    description:
      'Deploying and managing applications on AWS, GCP, and containerized environments with CI/CD automation.',
    longDescription:
      'I deploy and manage cloud-native applications across AWS, GCP, and Heroku with a focus on reliability and scalability. From containerized deployments with Docker and Kubernetes to CI/CD pipeline design with Jenkins and GitHub Actions, I streamline the path from code to production. I help teams automate infrastructure, reduce deployment friction, and maintain production stability.',
    icon: 'Cloud',
    highlights: [
      'AWS and GCP cloud deployments',
      'Docker containerization and Kubernetes orchestration',
      'CI/CD pipeline design with Jenkins',
      'CloudFoundry and Heroku deployments',
      'Infrastructure automation and monitoring',
    ],
  },
  {
    id: 'svc-4',
    title: 'Enterprise Software Solutions',
    description:
      'Building enterprise-grade SaaS platforms, management systems, and internal tooling with microservices architecture.',
    longDescription:
      'With experience at companies like SAP and Systems Limited, I build enterprise solutions that handle complex business logic at scale. This includes microservices architecture, real-time dashboards with data visualization, role-based access control, and integration with enterprise tools like SAP UI5 and Fiori. I follow Agile/Scrum methodologies and maintain rigorous code quality through TDD and code reviews.',
    icon: 'Cpu',
    highlights: [
      'Microservices architecture design',
      'Enterprise SaaS platform development',
      'SAP UI5 and Fiori integration',
      'Real-time dashboards and data visualization',
      'Agile/Scrum delivery methodology',
    ],
  },
  {
    id: 'svc-5',
    title: 'CMS & Platform Development',
    description:
      'Custom CMS solutions, platform optimization, and content management system integration for web applications.',
    longDescription:
      'I develop and optimize content management platforms using tools like Craft CMS integrated with modern React frontends. Services include CMS customization, performance optimization, content workflow design, and seamless integration with third-party services. I ensure content teams have the tools they need while maintaining the performance and scalability that users expect.',
    icon: 'MessageSquareCode',
    highlights: [
      'Craft CMS development and customization',
      'CMS-to-React frontend integration',
      'Content workflow optimization',
      'Platform performance tuning',
      'Third-party service integration',
    ],
  },
] as const satisfies Service[]
