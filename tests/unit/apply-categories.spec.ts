import { describe, expect, it } from 'vitest'
import { applyCategories } from '@/lib/applyCategories'
import { cloneSeed } from '@/data/ikigaiSeed'

describe('applyCategories', () => {
  it('sets data-category from node.data.category', () => {
    const root = document.createElement('div')
    root.innerHTML = `
      <svg>
        <g class="vd-flowchart-node" data-node-id="tile-love-1"></g>
        <g class="vd-flowchart-node" data-node-id="tile-good-1"></g>
      </svg>
    `
    const doc = cloneSeed()
    const count = applyCategories(root, doc)
    expect(count).toBeGreaterThanOrEqual(2)
    expect(root.querySelector('[data-node-id="tile-love-1"]')?.getAttribute('data-category')).toBe(
      'love',
    )
    expect(root.querySelector('[data-node-id="tile-good-1"]')?.getAttribute('data-category')).toBe(
      'goodAt',
    )
  })
})
