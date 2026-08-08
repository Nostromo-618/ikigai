import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const siteCss = readFileSync(join(process.cwd(), 'src/styles/site.css'), 'utf8')
const mapCss = readFileSync(join(process.cwd(), 'src/styles/ikigai-map.css'), 'utf8')

describe('map stage height chain', () => {
  it('gives .map-stage an explicit height so % children resolve', () => {
    const block = siteCss.match(/\.map-stage\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(block).toMatch(/display:\s*flex/)
    expect(block).toMatch(/flex-direction:\s*column/)
    expect(block).toMatch(/height:\s*70vh/)
    expect(block).toMatch(/min-height:\s*70vh/)
  })

  it('keeps map actions chrome inside the stage so fullscreen retains exports/exit', () => {
    const block = siteCss.match(/\.map-stage \.map-toolbar\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(block).toMatch(/flex-shrink:\s*0/)
    expect(block).toMatch(/margin:\s*0/)
    expect(siteCss).toMatch(/\.map-stage \.map-toolbar-fullscreen\s*\{[^}]*margin-left:\s*auto/s)
  })

  it('forces the flowchart host to height:100% of the definite stage', () => {
    const block =
      siteCss.match(/\.map-stage \.vd-flowchart-host,\s*\.map-stage \.vd-flowchart\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(block).toMatch(/flex:\s*1/)
    expect(block).toMatch(/min-height:\s*0/)
    expect(block).toMatch(/height:\s*100%\s*!important/)
    expect(block).not.toMatch(/height:\s*auto/)
  })

  it('stretches shell, body, palette, and canvas to fill below the toolbar', () => {
    expect(mapCss).toMatch(/\.map-stage \.vd-flowchart-panel--inspector[\s\S]*?display:\s*none\s*!important/)
    expect(mapCss).toMatch(/\.map-stage \.vd-flowchart-shell\s*\{[^}]*height:\s*100%\s*!important/s)

    const body = mapCss.match(/\.map-stage \.vd-flowchart-body\s*\{[^}]+\}/s)?.[0] ?? ''
    expect(body).toMatch(/grid-template-columns:\s*88px minmax\(0,\s*1fr\)\s*!important/)
    expect(body).toMatch(/grid-template-rows:\s*minmax\(0,\s*1fr\)\s*!important/)
    expect(body).toMatch(/height:\s*100%\s*!important/)

    const panels =
      mapCss.match(
        /\.map-stage \.vd-flowchart-panel--palette,\s*\.map-stage \.vd-flowchart-canvas\s*\{[^}]+\}/s,
      )?.[0] ?? ''
    expect(panels).toMatch(/align-self:\s*stretch\s*!important/)
    expect(panels).toMatch(/height:\s*100%\s*!important/)
    expect(panels).toMatch(/min-height:\s*100%\s*!important/)
  })
})
