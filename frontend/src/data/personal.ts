// ─── Personal Information ────────────────────────────────────────────────────

export interface SocialLink {
  platform: string
  url: string
  handle: string
}

export interface PersonalInfo {
  name: string
  firstName: string
  lastName: string
  title: string
  tagline: string
  bio: string
  shortBio: string
  location: {
    city: string
    country: string
    timezone: string
  }
  yearsOfExperience: number
  email: string
  avatar: string
  resumeUrl: string
  socialLinks: SocialLink[]
  highlights: string[]
}

export const personalInfo: PersonalInfo = {
  name: 'Fida Hussain',
  firstName: 'Fida',
  lastName: 'Hussain',
  title: 'Full Stack JavaScript Developer',
  tagline: 'Full Stack Developer specializing in React & Node.js — based in Germany',
  bio: 'Full Stack JavaScript Developer with 7+ years of hands-on experience building production-grade web applications across enterprise, SaaS, and cloud platforms. From crafting pixel-perfect React frontends to engineering robust Node.js backends and managing cloud deployments on AWS and GCP, I deliver end-to-end solutions that scale. Currently working as a DevOps Engineer at SAP while continuing to push boundaries across the full stack.',
  shortBio: 'Full Stack JavaScript Developer with 7+ years of experience building scalable web applications with React, Node.js, and cloud technologies.',
  location: {
    city: 'Bruchsal',
    country: 'Germany',
    timezone: 'CET (UTC+1)',
  },
  yearsOfExperience: 7,
  email: 'fida.hussain0101199@gmail.com',
  avatar: '/placeholder-avatar.jpg',
  // Fallback to LinkedIn profile until a PDF resume is added to /public
  resumeUrl: 'https://www.linkedin.com/in/fidahussain87',
  socialLinks: [
    {
      platform: 'GitHub',
      url: 'https://github.com/FidaHussain87',
      handle: 'FidaHussain87',
    },
    {
      platform: 'LinkedIn',
      url: 'https://linkedin.com/in/fidahussain87',
      handle: 'fidahussain87',
    },
    {
      platform: 'Twitter',
      url: 'https://twitter.com/fidahussain87',
      handle: '@fidahussain87',
    },
    {
      platform: 'Email',
      url: 'mailto:fida.hussain0101199@gmail.com',
      handle: 'fida.hussain0101199@gmail.com',
    },
  ],
  highlights: [
    '86+ GitHub Repositories',
    'Arctic Code Vault Contributor',
    '7+ Years Professional Experience',
    'Bachelor of Engineering (3.62/4 CGPA)',
  ],
} as const satisfies PersonalInfo
