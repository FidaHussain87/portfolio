// ─── GitHub Stats & Activity ─────────────────────────────────────────────────

export interface GitHubStats {
  username: string
  profileUrl: string
  totalRepos: number
  totalStars: number
  totalForks: number
  totalContributions: number
  followers: number
  following: number
  publicGists: number
}

export interface GitHubAchievement {
  id: string
  title: string
  description: string
  icon: string
  earnedDate: string
}

/** Activity level for a single day: 0 = no activity, 4 = maximum activity */
export type ActivityLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionWeek {
  weekIndex: number
  days: ActivityLevel[]
}

export const githubStats: GitHubStats = {
  username: 'FidaHussain87',
  profileUrl: 'https://github.com/FidaHussain87',
  totalRepos: 86,
  totalStars: 342,
  totalForks: 127,
  totalContributions: 2847,
  followers: 215,
  following: 68,
  publicGists: 14,
} as const satisfies GitHubStats

export const githubAchievements: GitHubAchievement[] = [
  {
    id: 'ach-1',
    title: 'Arctic Code Vault Contributor',
    description:
      'Contributed code to repositories preserved in the GitHub Arctic Code Vault in Svalbard, Norway.',
    icon: 'arctic-code-vault',
    earnedDate: '2020-07-16',
  },
  {
    id: 'ach-2',
    title: 'Pull Shark',
    description:
      'Opened and merged multiple pull requests across open-source repositories.',
    icon: 'pull-shark',
    earnedDate: '2022-03-10',
  },
  {
    id: 'ach-3',
    title: 'YOLO',
    description:
      'Merged a pull request without a code review. Living on the edge.',
    icon: 'yolo',
    earnedDate: '2021-08-22',
  },
  {
    id: 'ach-4',
    title: 'Quickdraw',
    description:
      'Closed an issue or pull request within 5 minutes of it being opened.',
    icon: 'quickdraw',
    earnedDate: '2021-11-05',
  },
  {
    id: 'ach-5',
    title: 'Starstruck',
    description:
      'Created a repository that received a significant number of stars from the community.',
    icon: 'starstruck',
    earnedDate: '2023-01-18',
  },
] as const satisfies GitHubAchievement[]

/**
 * Contribution grid data for 52 weeks (364 days).
 * Each week contains 7 days (Sun-Sat) with activity levels 0-4.
 * This simulates a realistic contribution pattern for an active developer.
 */
export const contributionGrid: ContributionWeek[] = [
  { weekIndex: 0, days: [0, 2, 3, 2, 3, 1, 0] },
  { weekIndex: 1, days: [0, 3, 4, 3, 2, 2, 0] },
  { weekIndex: 2, days: [1, 2, 2, 3, 4, 1, 0] },
  { weekIndex: 3, days: [0, 1, 3, 2, 3, 2, 1] },
  { weekIndex: 4, days: [0, 4, 3, 4, 3, 2, 0] },
  { weekIndex: 5, days: [0, 2, 2, 1, 3, 1, 0] },
  { weekIndex: 6, days: [1, 3, 4, 3, 4, 2, 0] },
  { weekIndex: 7, days: [0, 2, 3, 2, 2, 1, 0] },
  { weekIndex: 8, days: [0, 1, 2, 3, 2, 1, 0] },
  { weekIndex: 9, days: [0, 3, 3, 4, 3, 2, 1] },
  { weekIndex: 10, days: [0, 4, 4, 3, 4, 3, 0] },
  { weekIndex: 11, days: [1, 2, 3, 2, 2, 1, 0] },
  { weekIndex: 12, days: [0, 3, 2, 3, 3, 2, 0] },
  { weekIndex: 13, days: [0, 1, 2, 1, 2, 0, 0] },
  { weekIndex: 14, days: [0, 2, 3, 3, 4, 2, 1] },
  { weekIndex: 15, days: [0, 3, 4, 3, 3, 1, 0] },
  { weekIndex: 16, days: [1, 2, 2, 3, 2, 2, 0] },
  { weekIndex: 17, days: [0, 4, 3, 4, 4, 3, 1] },
  { weekIndex: 18, days: [0, 2, 3, 2, 3, 1, 0] },
  { weekIndex: 19, days: [0, 1, 2, 2, 1, 1, 0] },
  { weekIndex: 20, days: [0, 3, 3, 4, 3, 2, 0] },
  { weekIndex: 21, days: [1, 2, 4, 3, 4, 2, 1] },
  { weekIndex: 22, days: [0, 3, 2, 3, 2, 1, 0] },
  { weekIndex: 23, days: [0, 1, 2, 1, 2, 1, 0] },
  { weekIndex: 24, days: [0, 2, 3, 3, 3, 2, 0] },
  { weekIndex: 25, days: [1, 3, 4, 4, 3, 2, 0] },
  { weekIndex: 26, days: [0, 2, 2, 3, 2, 1, 0] },
  { weekIndex: 27, days: [0, 4, 3, 4, 4, 3, 1] },
  { weekIndex: 28, days: [0, 1, 2, 2, 3, 1, 0] },
  { weekIndex: 29, days: [0, 3, 3, 2, 3, 2, 0] },
  { weekIndex: 30, days: [1, 2, 4, 3, 2, 1, 0] },
  { weekIndex: 31, days: [0, 3, 3, 4, 3, 2, 1] },
  { weekIndex: 32, days: [0, 1, 2, 2, 1, 0, 0] },
  { weekIndex: 33, days: [0, 2, 3, 3, 4, 2, 0] },
  { weekIndex: 34, days: [0, 4, 4, 3, 3, 3, 1] },
  { weekIndex: 35, days: [1, 2, 2, 3, 2, 1, 0] },
  { weekIndex: 36, days: [0, 3, 3, 4, 3, 2, 0] },
  { weekIndex: 37, days: [0, 1, 2, 2, 3, 1, 0] },
  { weekIndex: 38, days: [0, 2, 3, 3, 2, 2, 0] },
  { weekIndex: 39, days: [1, 3, 4, 3, 4, 2, 1] },
  { weekIndex: 40, days: [0, 2, 2, 3, 2, 1, 0] },
  { weekIndex: 41, days: [0, 4, 3, 4, 3, 3, 0] },
  { weekIndex: 42, days: [0, 1, 2, 1, 2, 0, 0] },
  { weekIndex: 43, days: [0, 3, 3, 3, 4, 2, 1] },
  { weekIndex: 44, days: [1, 2, 4, 3, 3, 2, 0] },
  { weekIndex: 45, days: [0, 3, 2, 3, 2, 1, 0] },
  { weekIndex: 46, days: [0, 1, 3, 2, 3, 2, 0] },
  { weekIndex: 47, days: [0, 4, 4, 4, 3, 3, 1] },
  { weekIndex: 48, days: [1, 2, 3, 2, 2, 1, 0] },
  { weekIndex: 49, days: [0, 3, 2, 3, 3, 2, 0] },
  { weekIndex: 50, days: [0, 2, 3, 4, 3, 1, 0] },
  { weekIndex: 51, days: [0, 1, 2, 2, 1, 0, 0] },
] as const satisfies ContributionWeek[]
