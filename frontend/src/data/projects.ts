// ─── Portfolio Projects ──────────────────────────────────────────────────────

export type ProjectCategory = 'fullstack' | 'ai' | 'cloud' | 'iot'

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  techStack: string[]
  category: ProjectCategory
  featured: boolean
  links: {
    github?: string
    live?: string
  }
}

export const projects: Project[] = [
  {
    id: 'proj-0',
    title: 'GMP — Multi-Cloud Platform',
    description:
      'An enterprise-scale multi-cloud infrastructure management platform at SAP that provisions and manages resources across AWS, Azure, GCP, OpenStack, STACKIT, IBM Cloud, and Alibaba Cloud.',
    longDescription:
      'Developing GMP at SAP — a mission-critical platform managing cloud infrastructure across 7+ providers. The application features a strict layered architecture with 2,600+ Perl modules, 617 self-service execution modules, and 87 data access objects. The platform routes infrastructure requests through Service, ISMR, ISM, and ExtComm layers to provision virtual machines, storage, DNS, networks, and load balancers. Backed by 894+ automated tests, GitLab CI/CD pipelines, Docker containerization, and multi-region Kubernetes deployments.',
    image: '',
    techStack: [
      'Perl',
      'Python',
      'PostgreSQL',
      'REST APIs',
      'Docker',
      'Kubernetes',
      'GitLab CI/CD',
      'Apache',
      'Grafana',
      'AWS',
      'Azure',
      'GCP',
      'OpenStack',
      'IBM Cloud',
      'Alibaba Cloud',
    ],
    category: 'cloud',
    featured: true,
    links: {},
  },
  {
    id: 'proj-ieman',
    title: 'iEman',
    description:
      'A full-stack Progressive Web App for reading, studying, and learning the Holy Quran with community features, gamification, and multimedia support.',
    longDescription:
      'iEman is a comprehensive Islamic learning platform built as a PWA with React and Node.js. Features include multi-translation Quran reading with audio recitations from renowned reciters, word-by-word recitation, prayer times with notifications, Qibla direction finder, nearby mosques locator, reading streak tracking with gamification, community posts and verse-level discussions, structured learning plans, and a PDF book library. Supports Google OAuth, two-factor authentication, AI-powered search, real-time WebSocket notifications, and a full admin dashboard. Backed by 25+ PostgreSQL tables with Drizzle ORM.',
    image: '',
    techStack: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'PostgreSQL',
      'Drizzle ORM',
      'Tailwind CSS',
      'Radix UI',
      'TanStack Query',
      'Framer Motion',
      'WebSockets',
      'JWT',
      'Google OAuth',
      'Vercel',
    ],
    category: 'fullstack',
    featured: true,
    links: {
      github: 'https://github.com/FidaHussain87',
    },
  },
  {
    id: 'proj-1',
    title: 'SBTi Climate Platform',
    description:
      'A comprehensive web application for setting and validating science-based emission reduction targets for corporations worldwide.',
    longDescription:
      'Built at the Science Based Targets initiative, this platform enables companies to set, validate, and track science-based emission reduction targets aligned with the Paris Agreement. Developed with React and Craft CMS, deployed on GCP for scalability. Features include complex form workflows, real-time validation logic, and performance-optimized rendering for data-heavy dashboards supporting corporate climate action.',
    image: '',
    techStack: [
      'React',
      'TypeScript',
      'Node.js',
      'PHP',
      'Craft CMS',
      'MySQL',
      'Tailwind CSS',
      'GCP',
      'Python',
    ],
    category: 'fullstack',
    featured: true,
    links: {
      live: 'https://sciencebasedtargets.org',
    },
  },
  {
    id: 'proj-2',
    title: 'Visit Management System',
    description:
      'A cloud-based enterprise web application facilitating seamless appointment scheduling and visitor management at SAP.',
    longDescription:
      'Developed at SAP as part of a 10-person Scrum team, this cloud-based Visit Management System streamlines appointment scheduling across SAP office locations. Originally built with React, it was migrated to the SAP UI5 framework for enterprise compliance. Features CloudFoundry connectivity, cross-browser compatibility, and performance optimizations achieved through systematic analysis.',
    image: '',
    techStack: [
      'JavaScript',
      'React',
      'SAP UI5',
      'SAP Fiori',
      'Node.js',
      'Web Components',
      'Tailwind CSS',
      'CloudFoundry',
      'Jenkins',
    ],
    category: 'cloud',
    featured: true,
    links: {},
  },
  {
    id: 'proj-3',
    title: 'Cargo Rostering System',
    description:
      'A cloud-based SaaS enterprise management platform for ports and terminals with real-time data visualization.',
    longDescription:
      'Built at Systems Limited, this cargo rostering system is a full-featured SaaS management platform serving ports and terminals. The platform includes real-time data visualization with ApexCharts, complex grid management with agGrid, and 20+ REST APIs following microservices architecture. Achieved 75% code coverage through rigorous TDD and automation testing practices.',
    image: '',
    techStack: [
      'React',
      'Redux',
      'JavaScript',
      'Jest',
      'Material-UI',
      'ApexCharts',
      'agGrid',
      'Microservices',
      'Azure DevOps',
    ],
    category: 'fullstack',
    featured: true,
    links: {},
  },
  {
    id: 'proj-4',
    title: 'Appointment Booking Platform',
    description:
      'A cloud-based B2C platform for booking appointments across diverse service providers like marriage halls and car wash services.',
    longDescription:
      'A scalable B2C appointment booking platform built with React and Node.js, deployed on AWS EC2 with Docker containers. Features include user authentication, image uploading, email verification via Nodemailer, and 25+ REST API endpoints. The application includes 20+ reusable components and achieved 85% code coverage for both API and UI layers.',
    image: '',
    techStack: [
      'React',
      'TypeScript',
      'Node.js',
      'Express',
      'MongoDB',
      'Jest',
      'Docker',
      'AWS',
      'Nodemailer',
    ],
    category: 'fullstack',
    featured: false,
    links: {
      github: 'https://github.com/FidaHussain87',
    },
  },
  {
    id: 'proj-5',
    title: 'Hotel Chain Management',
    description:
      'A cloud-based management platform for a hotel chain in Pakistan to manage employees and payroll across multiple locations.',
    longDescription:
      'Developed at Geeks Consultancy, this platform handles employee management and payroll processing for a hotel chain in Pakistan. Built with React and Node.js with dual database support (MongoDB and MySQL). Delivered 10+ features across the full stack, reduced REST API calls by 30% through optimization, and maintained thorough unit testing before production deployment.',
    image: '',
    techStack: [
      'React',
      'Redux',
      'Node.js',
      'Express',
      'MongoDB',
      'MySQL',
      'Bootstrap',
      'Jest',
      'Git',
    ],
    category: 'fullstack',
    featured: false,
    links: {
      github: 'https://github.com/FidaHussain87',
    },
  },
  {
    id: 'proj-6',
    title: 'CyberNet Enterprise Portal',
    description:
      'An internal cloud-based web application portal for managing employees, inventory, and the billing system.',
    longDescription:
      'Built at CyberNet, this internal enterprise portal streamlines employee management, inventory tracking, and billing operations. Features include an optimized inventory records table for efficient data retrieval, reusable React components for the inventory module, and CRUD operations following MVC design patterns. The system improved operational efficiency by centralizing multiple management workflows.',
    image: '',
    techStack: [
      'React',
      'JavaScript',
      'MySQL',
      'Bootstrap',
      'MVC',
      'Git',
    ],
    category: 'fullstack',
    featured: false,
    links: {
      github: 'https://github.com/FidaHussain87',
    },
  },
] as const satisfies Project[]

export const projectCategories = [
  { id: 'all' as const, label: 'All Projects' },
  { id: 'fullstack' as const, label: 'Full Stack' },
  { id: 'cloud' as const, label: 'Cloud' },
] as const
