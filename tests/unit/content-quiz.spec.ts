import { describe, expect, it } from 'vitest'
import {
  QUIZ_DIMENSION_MAX,
  QUIZ_ITEMS,
  quizDimensionChartData,
  scoreLabel,
  scoreQuiz,
} from '@/content/quiz'
import { LEARN_SECTIONS } from '@/content/types'
import { origins } from '@/content/origins'
import { western } from '@/content/western'
import { facts } from '@/content/facts'

describe('quiz scoring', () => {
  it('returns null when incomplete', () => {
    expect(scoreQuiz({ 1: 5 })).toBeNull()
  })

  it('sums dimensions', () => {
    const answers: Record<number, number> = {}
    for (const item of QUIZ_ITEMS) answers[item.id] = 3
    const score = scoreQuiz(answers)!
    expect(score.total).toBe(27)
    expect(score.max).toBe(45)
    expect(score.emotions).toBe(9)
    expect(score.future).toBe(9)
    expect(score.meaning).toBe(9)
    expect(score.percent).toBe(60)
    expect(scoreLabel(score)).toMatch(/Solid foundation/)
  })

  it('builds dimension chart rows for VdChart', () => {
    const answers: Record<number, number> = {}
    for (const item of QUIZ_ITEMS) {
      answers[item.id] = item.dimension === 'emotions' ? 5 : item.dimension === 'future' ? 3 : 1
    }
    const score = scoreQuiz(answers)!
    expect(quizDimensionChartData(score)).toEqual([
      { label: 'Emotions', score: 15, max: QUIZ_DIMENSION_MAX },
      { label: 'Future', score: 9, max: QUIZ_DIMENSION_MAX },
      { label: 'Meaning', score: 3, max: QUIZ_DIMENSION_MAX },
    ])
  })
})

describe('content modules', () => {
  it('exposes read sections with paths', () => {
    expect(LEARN_SECTIONS.length).toBeGreaterThanOrEqual(7)
    for (const s of LEARN_SECTIONS) {
      expect(s.path.startsWith('/read')).toBe(true)
      expect(s.title.length).toBeGreaterThan(0)
    }
  })

  it('has origins tables and western honesty note', () => {
    expect(origins.kamiyaNeeds.rows.length).toBe(7)
    expect(origins.mogiPillars.rows.length).toBe(5)
    expect(western.honesty.toLowerCase()).toContain('western')
    expect(facts.items.length).toBeGreaterThanOrEqual(5)
  })
})
