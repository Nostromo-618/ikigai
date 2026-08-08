export type IkigaiCategory =
  | 'love'
  | 'goodAt'
  | 'worldNeeds'
  | 'paidFor'
  | 'passion'
  | 'mission'
  | 'profession'
  | 'vocation'
  | 'ikigai'

export interface ContentSection {
  slug: string
  title: string
  description: string
  path: string
}

export const LEARN_SECTIONS: ContentSection[] = [
  {
    slug: 'origins',
    title: 'Origins & authentic philosophy',
    description: 'Heian etymology, Mieko Kamiya, and Ken Mogi’s five pillars.',
    path: '/read/origins',
  },
  {
    slug: 'western-diagram',
    title: 'The Western four-circle diagram',
    description: 'How Propósito became “Ikigai” — and what the intersections mean.',
    path: '/read/western-diagram',
  },
  {
    slug: 'blue-zones',
    title: 'Blue Zones & Okinawa',
    description: 'Moai, Hara Hachi Bun Me, and longevity without a word for retirement.',
    path: '/read/blue-zones',
  },
  {
    slug: 'science',
    title: 'Science & psychometrics',
    description: 'Ohsaki cohort findings, Ikigai-9, and burnout research.',
    path: '/read/science',
  },
  {
    slug: 'compare',
    title: 'Comparative frameworks',
    description: 'Maslow, Frankl’s logotherapy, wabi-sabi, and kaizen.',
    path: '/read/compare',
  },
  {
    slug: 'stories',
    title: 'Biographies of purpose',
    description: 'Hokusai, Steve Jobs, and Marie Curie as lived maps.',
    path: '/read/stories',
  },
  {
    slug: 'facts',
    title: 'Fun facts',
    description: 'Shell games, 45-minute mash-ups, and the 96th birthday.',
    path: '/read/facts',
  },
]

export interface TableRow {
  headers: string[]
  rows: string[][]
}
