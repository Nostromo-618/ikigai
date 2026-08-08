import { describe, expect, it } from 'vitest'
import { withBase } from '@/utils/withBase'
import { abs } from '@/composables/useSeo'

describe('withBase', () => {
  it('leaves absolute urls alone', () => {
    expect(withBase('https://example.com/a.png')).toBe('https://example.com/a.png')
  })

  it('prefixes relative paths', () => {
    const out = withBase('/favicon.svg')
    expect(out.endsWith('favicon.svg')).toBe(true)
  })
})

describe('abs', () => {
  it('builds absolute urls for SEO', () => {
    expect(abs('/map')).toContain('/map')
    expect(abs('https://example.com/x')).toBe('https://example.com/x')
  })

  it('resolves default og image under the site origin', () => {
    const url = abs('/og-default.svg')
    expect(url).toMatch(/^https?:\/\//)
    expect(url.endsWith('/og-default.svg')).toBe(true)
    expect(url).not.toContain('/ikigai/ikigai/')
  })
})
