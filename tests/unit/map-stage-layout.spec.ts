import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const siteCss = readFileSync(join(process.cwd(), 'src/styles/site.css'), 'utf8')
const mapCss = readFileSync(join(process.cwd(), 'src/styles/ikigai-map.css'), 'utf8')

describe('map stage height chain', () => {
  it('makes .map-stage a flex column so the host gets a definite height', () => {
    const block = siteCss.match(/\.map-stage\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(block).toMatch(/display:\s*flex/)
    expect(block).toMatch(/flex-direction:\s*column/)
    expect(block).toMatch(/min-height:\s*70vh/)
  })

  it('lets the flowchart host flex-fill instead of height:100% of an indefinite parent', () => {
    const block =
      siteCss.match(/\.map-stage \.vd-flowchart-host,\s*\.map-stage \.vd-flowchart\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(block).toMatch(/flex:\s*1/)
    expect(block).toMatch(/min-height:\s*0/)
    expect(block).not.toMatch(/height:\s*100%/)
  })

  it('keeps palette|canvas body rows and hides the inspector track', () => {
    expect(mapCss).toMatch(/\.map-stage \.vd-flowchart-panel--inspector[\s\S]*?display:\s*none\s*!important/)
    const body = mapCss.match(/\.map-stage \.vd-flowchart-body\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(body).toMatch(/grid-template-columns:\s*88px minmax\(0,\s*1fr\)\s*!important/)
    expect(body).toMatch(/grid-template-rows:\s*minmax\(0,\s*1fr\)\s*!important/)
  })
})
