import { describe, expect, it } from 'vitest'
import { serializeFlowchartSvg } from '@/lib/export/svg'
import { injectDocumentIntoShell, HTML_DOC_PLACEHOLDER } from '@/lib/export/html'
import { cloneSeed } from '@/data/ikigaiSeed'

describe('export svg', () => {
  it('serializes a flowchart svg host', () => {
    const host = document.createElement('div')
    host.innerHTML = `
      <svg class="vd-flowchart-svg" xmlns="http://www.w3.org/2000/svg">
        <g class="vd-flowchart-world">
          <g class="vd-flowchart-node" data-node-id="a" transform="translate(10 20)">
            <rect width="100" height="50" fill="red"></rect>
            <rect class="vd-flowchart-node-shape" width="100" height="50"></rect>
          </g>
        </g>
        <g class="vd-flowchart-port-group"></g>
      </svg>
    `
    const markup = serializeFlowchartSvg(host, { background: '#fff' })
    expect(markup).toContain('<svg')
    expect(markup).toContain('viewBox=')
    expect(markup).not.toContain('vd-flowchart-port-group')
  })
})

describe('export html', () => {
  it('injects document JSON into shell placeholder', () => {
    const shell = `<html><script>window.__IKIGAI_DOCUMENT__ = ${HTML_DOC_PLACEHOLDER};</script></html>`
    const doc = cloneSeed()
    const out = injectDocumentIntoShell(shell, doc)
    expect(out).toContain('"id":"tile-love-1"')
    expect(out).not.toContain(HTML_DOC_PLACEHOLDER)
  })

  it('throws when placeholder missing', () => {
    expect(() => injectDocumentIntoShell('<html></html>', cloneSeed())).toThrow(/placeholder/)
  })
})
