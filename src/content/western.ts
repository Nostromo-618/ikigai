import type { TableRow } from './types'

export const western = {
  title: 'The Western four-circle diagram',
  description:
    'The famous Venn diagram is not ancient, not Japanese, and was not originally called ikigai — yet it remains a powerful life-design UX.',
  honesty:
    'Historical evidence is unequivocal: the four-circle graphic is a recent Western synthesis. This site uses it as an interactive architecture while honoring authentic Japanese philosophy elsewhere.',
  paragraphs: [
    'In 2011, Spanish astrologer Andrés Zuzunaga published a Venn diagram labeled Propósito (“purpose”) with four questions: What do you love? What are you good at? What does the world need? What can you be paid for? It synthesized Western self-development ideas with no connection to Japan or the word ikigai.',
    'In 2014, British entrepreneur Marc Winn — inspired by Dan Buettner’s TED talk on Okinawan longevity — swapped the central word “Purpose” for “Ikigai” and published the mash-up on his blog. He later said the post took about 45 minutes and called the viral aftermath a “serendipitous blunder.” The association was cemented by Héctor García and Francesc Miralles’ 2017 bestseller.',
    'Incomplete intersections explain familiar feelings: passion without pay, competence without joy, contribution without love, or mission without sustainability. The diagram works best as a slow, honest audit — populate it with specific actions, not vague abstractions.',
  ],
  intersections: {
    headers: ['Intersection', 'Formula', 'When incomplete'],
    rows: [
      [
        'Passion',
        'Love + Good at',
        'Joy and flow, but possible uselessness or financial insecurity if uncompensated.',
      ],
      [
        'Profession',
        'Good at + Paid for',
        'Stability and competence that can feel empty or joyless over time.',
      ],
      [
        'Vocation',
        'Paid for + World needs',
        'Income and contribution that may feel unsatisfying without love or skill.',
      ],
      [
        'Mission',
        'World needs + Love',
        'Purpose and altruism that can be economically unsustainable and lead to burnout.',
      ],
    ],
  } satisfies TableRow,
  tooltips: [
    {
      id: 'love',
      heading: 'Unveil your passion',
      text: 'Drag activities that make time fly into this circle. Don’t worry about money or skills yet — focus on joy.',
    },
    {
      id: 'goodAt',
      heading: 'Recognize your strengths',
      text: 'What skills come naturally? Drop specific talents and hard-earned expertise here.',
    },
    {
      id: 'worldNeeds',
      heading: 'Discover your mission',
      text: 'What problems do you care about solving? “The world” can be your neighborhood or family.',
    },
    {
      id: 'center',
      heading: 'Find the intersections',
      text: 'Look for tiles that belong in all four. The center is a working hypothesis — let it settle over time.',
    },
  ],
  emptyStates: {
    blank:
      'Your ikigai journey begins with a single step. Start by dragging just one activity you enjoyed this week into “What You Love.” There are no wrong answers.',
    emptyCenter:
      'It’s completely normal to have an empty center. Ikigai is meant to settle, not snap into place in an afternoon. Leave this blank and return next week.',
  },
}
