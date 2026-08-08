import type { TableRow } from './types'

export const origins = {
  title: 'Origins & authentic philosophy',
  description:
    'Ikigai literally means the value of being alive — rooted in Heian-period language, clinical psychiatry, and daily mindfulness rather than career diagrams.',
  paragraphs: [
    'The term ikigai (生き甲斐) is a compound of iki (生き) — “life” or “to be alive” — and gai (甲斐) — “worth,” “benefit,” or “value.” The suffix gai derives from kai, “shell.” During Japan’s Heian period (794–1185), intricately decorated shells were prized in aristocratic matching games, linking the word to inherent beauty and worth. In its most literal sense, ikigai means “the value of being alive” or “a reason for being.”',
    'Serious psychological study of ikigai was pioneered by Japanese psychiatrist Mieko Kamiya. In 1966 she published Ikigai ni tsuite (On the Meaning of Life), still a standard in Japanese clinical research. Working with leprosy patients at the Nagashima Aiseien Sanatorium, Kamiya observed that people who maintained a sense of ikigai showed extraordinary resilience. She described ikigai as “the power necessary to live in this world” and the “happiness to be alive” — not a scoreboard of economic success.',
    'Neuroscientist Ken Mogi argues that ikigai need not be a world-changing mission. It can be a spectrum of small daily habits that stimulate reward systems without constant external validation. Authentic practice asks people to stop hunting a single “true passion,” release lofty financial fantasies, and find meaning in mastery (chanto suru) and the quiet dignity of doing things properly.',
  ],
  kamiyaNeeds: {
    headers: ['Need', 'Psychological implication'],
    rows: [
      ['Life satisfaction', 'Contentment with the present, independent of external success.'],
      ['Change and growth', 'Purpose in lifelong learning and adaptation.'],
      ['A bright future (hope)', 'Something to look forward to, even amid hardship.'],
      ['Resonance (connection)', 'Belonging and the feeling of being needed.'],
      ['Freedom of choice', 'Autonomy aligned with the authentic self.'],
      ['Self-actualisation', 'Cultivating unique potential over a lifetime.'],
      ['Meaning and value', 'Conviction that efforts contribute beyond the self.'],
    ],
  } satisfies TableRow,
  mogiPillars: {
    headers: ['Pillar', 'Core idea'],
    rows: [
      ['Starting small', 'Careful minor tasks and gradual progress (kaizen).'],
      ['Releasing yourself', 'Let go of ego and external validation.'],
      ['Harmony and sustainability', 'Balance personal desire with community and environment.'],
      ['The joy of little things', 'Appreciate mundane experiences for steady reward.'],
      ['Being in the here and now', 'Mindfulness that dissolves past/future anxiety.'],
    ],
  } satisfies TableRow,
}
