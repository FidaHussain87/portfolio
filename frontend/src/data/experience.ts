// ─── Work Experience ─────────────────────────────────────────────────────────

export interface ExperienceEntry {
  id: string
  company: string
  companyUrl?: string
  role: string
  type: 'full-time' | 'contract' | 'freelance'
  period: {
    start: string
    end: string | null // null = present
  }
  location: string
  description: string
  achievements: string[]
  techStack: string[]
}

export const experience: ExperienceEntry[] = [
  {
    id: 'exp-1',
    company: 'SAP',
    companyUrl: 'https://www.sap.com',
    role: 'DevOps Engineer',
    type: 'full-time',
    period: {
      start: '2025-01',
      end: null,
    },
    location: 'Sankt Leon-Rot, Germany · On-site',
    description:
      'Developing GMP — an enterprise-scale multi-cloud infrastructure management application that provisions and manages resources across AWS, Azure, GCP, OpenStack, and STACKIT. Building backend services in Perl following a strict layered architecture with 2,600+ modules, 617 self-service execution modules, and 894+ test files.',
    achievements: [
      'Developing backend Perl services for multi-cloud infrastructure provisioning across 7+ cloud providers (AWS, Azure, GCP, OpenStack, STACKIT, IBM Cloud, Alibaba Cloud)',
      'Implementing self-service execution modules and REST APIs following strict layered architecture (Service → ISMR → ISM → ExtComm)',
      'Writing comprehensive unit and integration tests using Test::More and Test::MockModule, maintaining rigorous code coverage',
      'Building and maintaining GitLab CI/CD pipelines with Docker containerization and Kubernetes deployments across multi-region environments',
      'Collaborating with cross-functional teams managing infrastructure service adapters, DAO layers, and cloud provider integrations',
    ],
    techStack: [
      'Perl',
      'Python',
      'PostgreSQL',
      'Docker',
      'Kubernetes',
      'GitLab CI/CD',
      'REST APIs',
      'Apache',
      'Grafana',
      'Linux',
      'Git',
      'AWS',
      'Azure',
      'GCP',
      'OpenStack',
      'IBM Cloud',
      'Alibaba Cloud',
    ],
  },
  {
    id: 'exp-2',
    company: 'Science Based Targets initiative (SBTi)',
    companyUrl: 'https://sciencebasedtargets.org',
    role: 'Full Stack Developer',
    type: 'full-time',
    period: {
      start: '2024-03',
      end: '2024-12',
    },
    location: 'Berlin, Germany · Hybrid',
    description:
      'Developed a comprehensive web application for setting and validating science-based emission reduction targets. Collaborated in a 7-person Scrum team, translating Figma designs into production React components while optimizing platform performance on GCP cloud infrastructure.',
    achievements: [
      'Enhanced Craft CMS web application performance through strategic optimization and fine-tuning',
      'Translated complex Figma designs into pixel-perfect ReactJS components with design system adherence',
      'Deployed and managed the web application on GCP cloud infrastructure for seamless scalability',
      'Optimized platform performance, scalability, and user engagement to support SBTi\'s corporate climate action mission',
    ],
    techStack: [
      'JavaScript',
      'TypeScript',
      'React',
      'Node.js',
      'PHP',
      'Python',
      'Craft CMS',
      'MySQL',
      'Tailwind CSS',
      'GCP',
      'Figma',
    ],
  },
  {
    id: 'exp-3',
    company: 'SAP',
    companyUrl: 'https://www.sap.com',
    role: 'Full Stack Developer (Working Student)',
    type: 'full-time',
    period: {
      start: '2023-06',
      end: '2024-02',
    },
    location: 'Walldorf, Germany',
    description:
      'Worked as a working student in a 10-person Scrum team on the Visit Management Systems project — a seamless cloud-based web application facilitating appointment scheduling. Engaged in end-to-end software development cycles, migrating React frontends to the SAP UI5 framework.',
    achievements: [
      'Migrated ReactJS front-end applications to the SAP UI5 framework for enterprise compliance',
      'Established seamless connectivity with CloudFoundry, ensuring cross-browser compatibility',
      'Enhanced application performance and accessibility through systematic performance analysis',
      'Utilized JIRA, Confluence, Git, and Jenkins for efficient project management and CI/CD',
    ],
    techStack: [
      'JavaScript',
      'React',
      'Node.js',
      'SAP UI5',
      'SAP Fiori',
      'Web Components',
      'Tailwind CSS',
      'Git',
      'Jenkins',
    ],
  },
  {
    id: 'exp-4',
    company: 'Systems Limited',
    companyUrl: 'https://www.systemsltd.com',
    role: 'Full Stack JavaScript Developer',
    type: 'full-time',
    period: {
      start: '2021-08',
      end: '2022-07',
    },
    location: 'Karachi, Pakistan',
    description:
      'Built the Cargo Rostering Systems — a cloud-based SaaS management enterprise solution for ports and terminals. Worked in a 10-member Scrum team, leveraging frontend technologies and microservices architecture for a high-performance platform.',
    achievements: [
      'Designed and developed UI components with ReactJS, Material-UI, and ApexCharts aligned to project requirements',
      'Implemented 20+ REST APIs using microservices architecture for enhanced scalability and resilience',
      'Achieved 75% code coverage through rigorous Test-Driven Development and automation testing',
      'Resolved UI-level bugs and ensured system stability through thorough unit testing with Jest',
    ],
    techStack: [
      'JavaScript',
      'React',
      'Redux',
      'Jest',
      'Material-UI',
      'ApexCharts',
      'agGrid',
      'Azure DevOps',
      'Git',
    ],
  },
  {
    id: 'exp-5',
    company: 'AiTechSolutions',
    role: 'Full Stack JavaScript Developer',
    type: 'full-time',
    period: {
      start: '2020-12',
      end: '2021-08',
    },
    location: 'Karachi, Pakistan · Remote',
    description:
      'Developed a scalable cloud-based B2C platform for appointment booking (marriage halls, car wash services, etc.). Integrated frontend and backend technologies to build a user-friendly platform prioritizing robustness and performance.',
    achievements: [
      'Implemented 25+ REST API endpoints with Node.js and Express.js following industry best practices',
      'Developed 20+ custom reusable components with features like authentication and image uploading',
      'Created Docker images for faster deployment and deployed on AWS EC2 instances',
      'Achieved 85% code coverage for APIs and UI components through unit testing',
    ],
    techStack: [
      'JavaScript',
      'TypeScript',
      'React',
      'Bootstrap',
      'Jest',
      'Node.js',
      'Express',
      'MongoDB',
      'TypeORM',
      'AWS',
      'Docker',
    ],
  },
  {
    id: 'exp-6',
    company: 'Geeks Consultancy',
    role: 'Full Stack JavaScript Developer',
    type: 'full-time',
    period: {
      start: '2018-10',
      end: '2019-11',
    },
    location: 'Hyderabad, Pakistan',
    description:
      'Built a cloud-based hotel chain management platform to manage employees and payroll. Worked in an agile Scrum team delivering features across the full stack.',
    achievements: [
      'Delivered 10+ features across frontend and backend technologies in an agile Scrum team',
      'Reduced REST API calls by 30% through extensive code reviews and optimization',
      'Performed thorough unit testing for APIs and UI components before production deployment',
    ],
    techStack: [
      'JavaScript',
      'React',
      'Redux',
      'Bootstrap',
      'Node.js',
      'Express',
      'Jest',
      'MongoDB',
      'MySQL',
      'Git',
    ],
  },
  {
    id: 'exp-7',
    company: 'CyberNet',
    role: 'Full Stack JavaScript Developer',
    type: 'full-time',
    period: {
      start: '2018-06',
      end: '2018-09',
    },
    location: 'Karachi, Pakistan',
    description:
      'Built an internal cloud-based web application portal to manage employees, inventory, and the billing system. Designed database structures and implemented reusable frontend components.',
    achievements: [
      'Designed and built a streamlined inventory records table, optimizing data organization and retrieval',
      'Implemented reusable components for the inventory module using ReactJS',
      'Developed CRUD operations for user management following MVC design patterns',
    ],
    techStack: [
      'JavaScript',
      'React',
      'Bootstrap',
      'MySQL',
      'MVC',
      'Git',
    ],
  },
] as const satisfies ExperienceEntry[]
