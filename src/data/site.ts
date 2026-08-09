/** Site metadata — no Vue imports (safe for vite.config). */
export const SITE = {
  name: 'Ikigai',
  tagline: 'Map what you love, what you are good at, what the world needs, and what you can be paid for.',
  description:
    'An interactive Ikigai map built with Vanduo vd3. Explore the philosophy, take the Ikigai-9 quiz, and build a colorful flowchart that saves privately in your browser.',
  url: 'https://nostromo-618.github.io/ikigai',
  author: 'Ikigai',
  locale: 'en_US',
  twitter: 'summary_large_image',
  defaultImage: '/og-default.svg',
  theme: {
    PRIMARY_LIGHT: 'red',
    PRIMARY_DARK: 'red',
    NEUTRAL: 'slate',
    RADIUS: '0.25',
    FONT: 'system',
  },
  brandColor: '#E3300B',
} as const

export interface NavItem {
  label: string
  to: string
  icon: string
}

export const NAV: NavItem[] = [
  { label: 'Map', to: '/map', icon: 'map-trifold' },
  { label: 'Read', to: '/read', icon: 'book-open-text' },
  { label: 'Quiz', to: '/quiz', icon: 'exam' },
]

/**
 * Bump this when disclaimer text changes meaningfully — users must re-accept.
 * Stored value shape: `{ version: string, acceptedAt: string }`
 */
export const DISCLAIMER_VERSION = '2'

/** localStorage keys owned by this app (theme keys use ikigai- via vanduo remap). */
export const STORAGE_KEYS = {
  document: 'ikigai-flowchart-document',
  onboardingDone: 'ikigai-onboarding-done',
  quizScore: 'ikigai-quiz-score',
  /** Map stage fullscreen layout preference. */
  mapFullscreen: 'ikigai-map-fullscreen',
  /** @deprecated soft map banner; kept for migration cleanup only */
  disclaimerDismissed: 'ikigai-disclaimer-dismissed',
  /** Mandatory gate acceptance (versioned JSON). */
  disclaimerAccepted: 'ikigai-disclaimer-accepted',
} as const
