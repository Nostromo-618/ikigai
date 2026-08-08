import type { TableRow } from './types'

export const science = {
  title: 'Science & psychometrics',
  description:
    'Epidemiology and the Ikigai-9 scale show purpose correlating with lower mortality risk, disability, and better mental wellbeing.',
  paragraphs: [
    'The Ohsaki Study followed 43,391 Japanese adults for seven years. People who reported lacking ikigai had a multivariate-adjusted all-cause mortality hazard ratio of 1.5. Lack of ikigai associated with about 60% higher cardiovascular mortality risk (HR 1.6) and 90% higher risk from external causes (HR 1.9). Cancer mortality was not significantly elevated — suggesting protective effects tie more to heart health, stress, and behavior than cellular mutation.',
    'Among adults 65+, possessing ikigai associated with 31% lower risk of functional disability and 36% lower risk of dementia over three years. Other analyses link purpose to inflammatory and cardiovascular buffering under life stressors.',
    'Imai, Osada, and Nishimura developed the Ikigai-9 Scale in 2012. Fido and Kotera validated an English version in 2019: higher scores predicted greater mental wellbeing and lower depression (Cronbach’s α ≈ 0.88–0.90 across translations).',
    'In high-stress fields such as IT and nursing, research frames ikigai as a personal resource that supports engagement and can reduce turnover intention or emotional exhaustion — a proactive buffer beyond workload reduction alone.',
  ],
  ikigai9Dimensions: {
    headers: ['Dimension', 'Items (rate 1–5)'],
    rows: [
      [
        'Emotions toward life',
        'I often feel that I am happy; I have room in my mind; My life is mentally rich and fulfilled.',
      ],
      [
        'Attitudes toward the future',
        'I would like to learn something new; I am interested in many things; I would like to develop myself.',
      ],
      [
        'Meaning of existence',
        'I feel I am contributing to someone or society; My existence is needed; I believe I have some impact on someone.',
      ],
    ],
  } satisfies TableRow,
}
