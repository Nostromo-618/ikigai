export type QuizDimension = 'emotions' | 'future' | 'meaning'

export interface QuizItem {
  id: number
  dimension: QuizDimension
  text: string
}

/** Ikigai-9 items (English validation tradition). Scale 1–5. */
export const QUIZ_ITEMS: QuizItem[] = [
  { id: 1, dimension: 'emotions', text: 'I often feel that I am happy.' },
  { id: 2, dimension: 'future', text: 'I would like to learn something new or start something.' },
  { id: 3, dimension: 'meaning', text: 'I feel that I am contributing to someone or the society.' },
  { id: 4, dimension: 'emotions', text: 'I have room in my mind.' },
  { id: 5, dimension: 'future', text: 'I am interested in many things.' },
  { id: 6, dimension: 'meaning', text: 'I think that my existence is needed by something or someone.' },
  { id: 7, dimension: 'emotions', text: 'My life is mentally rich and fulfilled.' },
  { id: 8, dimension: 'future', text: 'I would like to develop myself.' },
  { id: 9, dimension: 'meaning', text: 'I believe that I have some impact on someone.' },
]

export interface QuizScore {
  total: number
  max: number
  emotions: number
  future: number
  meaning: number
  percent: number
}

export function scoreQuiz(answers: Record<number, number>): QuizScore | null {
  const values = QUIZ_ITEMS.map((item) => answers[item.id])
  if (values.some((v) => v == null || v < 1 || v > 5)) return null

  let emotions = 0
  let future = 0
  let meaning = 0
  for (const item of QUIZ_ITEMS) {
    const v = answers[item.id]!
    if (item.dimension === 'emotions') emotions += v
    else if (item.dimension === 'future') future += v
    else meaning += v
  }
  const total = emotions + future + meaning
  const max = QUIZ_ITEMS.length * 5
  return {
    total,
    max,
    emotions,
    future,
    meaning,
    percent: Math.round((total / max) * 100),
  }
}

export function scoreLabel(score: QuizScore): string {
  if (score.percent >= 80) return 'Strong sense of purpose readiness'
  if (score.percent >= 60) return 'Solid foundation — keep tending the small joys'
  if (score.percent >= 40) return 'Room to grow — start with one concrete activity on the map'
  return 'A beginning, not a verdict — ikigai settles; it does not snap into place'
}

/** Max points per Ikigai-9 dimension (3 items × 5). */
export const QUIZ_DIMENSION_MAX = 15

export const QUIZ_DIMENSION_CHART_LABELS = {
  emotions: 'Emotions',
  future: 'Future',
  meaning: 'Meaning',
} as const

export interface QuizDimensionChartRow {
  label: string
  score: number
  max: number
  [key: string]: string | number
}

/** Rows for a calm three-bar VdChart of dimension scores (each /15). */
export function quizDimensionChartData(score: QuizScore): QuizDimensionChartRow[] {
  return [
    {
      label: QUIZ_DIMENSION_CHART_LABELS.emotions,
      score: score.emotions,
      max: QUIZ_DIMENSION_MAX,
    },
    {
      label: QUIZ_DIMENSION_CHART_LABELS.future,
      score: score.future,
      max: QUIZ_DIMENSION_MAX,
    },
    {
      label: QUIZ_DIMENSION_CHART_LABELS.meaning,
      score: score.meaning,
      max: QUIZ_DIMENSION_MAX,
    },
  ]
}
