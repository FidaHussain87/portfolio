// ─── Skills & Tech Stack ─────────────────────────────────────────────────────

export interface Skill {
  name: string
  proficiency: number // 0-100
  icon?: string
}

export interface SkillCategory {
  id: string
  label: string
  description: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    label: 'Languages',
    description: 'Core programming languages used across projects',
    skills: [
      { name: 'JavaScript', proficiency: 95, icon: 'javascript' },
      { name: 'TypeScript', proficiency: 92, icon: 'typescript' },
      { name: 'PHP', proficiency: 72, icon: 'php' },
      { name: 'Python', proficiency: 70, icon: 'python' },
      { name: 'Perl', proficiency: 68, icon: 'perl' },
    ],
  },
  {
    id: 'frontend',
    label: 'Frontend',
    description: 'UI frameworks, libraries, and styling tools',
    skills: [
      { name: 'React', proficiency: 95, icon: 'react' },
      { name: 'Next.js', proficiency: 90, icon: 'nextjs' },
      { name: 'Redux', proficiency: 90, icon: 'redux' },
      { name: 'Tailwind CSS', proficiency: 92, icon: 'tailwindcss' },
      { name: 'Material-UI', proficiency: 85, icon: 'materialui' },
      { name: 'Bootstrap', proficiency: 88, icon: 'bootstrap' },
      { name: 'HTML / CSS', proficiency: 95, icon: 'html5' },
      { name: 'GSAP', proficiency: 85, icon: 'gsap' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend',
    description: 'Server-side frameworks, APIs, and runtime environments',
    skills: [
      { name: 'Node.js', proficiency: 93, icon: 'nodejs' },
      { name: 'Express', proficiency: 92, icon: 'express' },
      { name: 'NestJS', proficiency: 80, icon: 'nestjs' },
      { name: 'REST API', proficiency: 95, icon: 'api' },
      { name: 'GraphQL', proficiency: 75, icon: 'graphql' },
      { name: 'Microservices', proficiency: 85, icon: 'microservices' },
    ],
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    description: 'Cloud platforms, containerization, and CI/CD',
    skills: [
      { name: 'AWS', proficiency: 80, icon: 'aws' },
      { name: 'GCP', proficiency: 75, icon: 'gcp' },
      { name: 'Docker', proficiency: 82, icon: 'docker' },
      { name: 'Kubernetes', proficiency: 72, icon: 'kubernetes' },
      { name: 'Heroku', proficiency: 85, icon: 'heroku' },
      { name: 'Vercel', proficiency: 88, icon: 'vercel' },
      { name: 'Jenkins', proficiency: 75, icon: 'jenkins' },
      { name: 'Linux', proficiency: 85, icon: 'linux' },
    ],
  },
  {
    id: 'databases',
    label: 'Databases',
    description: 'Relational and document data stores',
    skills: [
      { name: 'PostgreSQL', proficiency: 88, icon: 'postgresql' },
      { name: 'MySQL', proficiency: 88, icon: 'mysql' },
      { name: 'MongoDB', proficiency: 88, icon: 'mongodb' },
    ],
  },
  {
    id: 'tools',
    label: 'Tools & Workflow',
    description: 'Development tools, testing, and design software',
    skills: [
      { name: 'Git', proficiency: 95, icon: 'git' },
      { name: 'Azure DevOps', proficiency: 80, icon: 'azure' },
      { name: 'Jest', proficiency: 90, icon: 'jest' },
      { name: 'Unit Testing', proficiency: 90, icon: 'testing' },
      { name: 'Figma', proficiency: 78, icon: 'figma' },
      { name: 'Agile / Scrum', proficiency: 92, icon: 'agile' },
      { name: 'JIRA', proficiency: 85, icon: 'jira' },
      { name: 'OAuth 2.0', proficiency: 82, icon: 'oauth' },
    ],
  },
] as const satisfies SkillCategory[]
