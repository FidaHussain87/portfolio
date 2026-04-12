// ─── Data Barrel Export ──────────────────────────────────────────────────────

// Personal
export { personalInfo } from './personal'
export type { PersonalInfo, SocialLink } from './personal'

// Skills
export { skillCategories } from './skills'
export type { Skill, SkillCategory } from './skills'

// Experience
export { experience } from './experience'
export type { ExperienceEntry } from './experience'

// Projects
export { projects, projectCategories } from './projects'
export type { Project, ProjectCategory } from './projects'

// Services
export { services } from './services'
export type { Service } from './services'

// Testimonials
export { testimonials } from './testimonials'
export type { Testimonial } from './testimonials'

// GitHub
export {
  githubStats,
  githubAchievements,
  contributionGrid,
} from './github'
export type {
  GitHubStats,
  GitHubAchievement,
  ActivityLevel,
  ContributionWeek,
} from './github'

// Navigation
export { navigation } from './navigation'
export type { NavItem } from './navigation'
