import type { TableRow } from './types'

export const compare = {
  title: 'Comparative frameworks',
  description:
    'Ikigai sits beside Maslow, Frankl, wabi-sabi, and kaizen — related questions with different cultural structures.',
  paragraphs: [
    'Maslow’s hierarchy is sequential: lower needs generally precede self-actualization. Ikigai (especially in Western circle form, or traditional daily pillars) is non-hierarchical — meaning asks whether skills, passions, contributions, and sustainability align now, regardless of wealth.',
    'Viktor Frankl’s logotherapy holds that the primary drive is meaning — “He who has a why to live can bear almost any how.” Logotherapy often finds meaning despite suffering; Japanese ikigai emphasizes meaning in baseline daily joy. Both reject a tensionless, apathetic life.',
    'Wabi-sabi values imperfect beauty — a meaningful life need not be flawlessly executed. Kaizen, continuous incremental improvement, is the operational rhythm that nurtures ikigai over years.',
  ],
  maslow: {
    headers: ['Axis', 'Maslow (US, 1943)', 'Ikigai (Japan)'],
    rows: [
      [
        'Structure',
        'Five-tier pyramid',
        'Overlapping circles (Western) or daily pillars (traditional); non-hierarchical',
      ],
      [
        'Progression',
        'Lower needs before higher pursuits',
        'Dimensions intersect in the present',
      ],
      [
        'Core question',
        'Which unmet need blocks progress?',
        'Are skills, passions, contributions, and sustainability aligned now?',
      ],
      [
        'Culture',
        'Western individualism and self-expression',
        'Eastern collectivism, harmony, social roles',
      ],
    ],
  } satisfies TableRow,
}
