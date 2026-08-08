import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const siteCss = readFileSync(join(process.cwd(), 'src/styles/site.css'), 'utf8')

describe('theme radius tokens', () => {
  it('aliases --vd-border-radius to the vd3 card/fib scale', () => {
    expect(siteCss).toMatch(/--vd-border-radius:\s*var\(--vd-card-border-radius\)/)
    expect(siteCss).toMatch(/--vd-radius:\s*var\(--vd-border-radius\)/)
  })

  it('uses theme radius on learn cards and key chrome', () => {
    const learnLink = siteCss.match(/\.learn-link\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(learnLink).toContain('border-radius: var(--vd-border-radius)')

    for (const selector of ['.quiz-result', '.map-stage', '.disclaimer', '.onboarding', '.likert label']) {
      const block = siteCss.match(new RegExp(`${selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\{[^}]+\\}`, 's'))?.[0] ?? ''
      expect(block, selector).toMatch(/border-radius:\s*var\(--vd-(?:border-radius|radius-fib-\d+)\)/)
    }
  })
})
