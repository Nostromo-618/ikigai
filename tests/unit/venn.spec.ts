import { describe, expect, it } from 'vitest'
import { createVennGroup, ensureVennInWorld } from '@/lib/vennBackdrop'

describe('vennBackdrop', () => {
  it('creates four circles and center label', () => {
    const g = createVennGroup()
    expect(g.querySelectorAll('.ikigai-venn-circle')).toHaveLength(4)
    expect(g.querySelector('.ikigai-venn-center')?.textContent).toBe('Ikigai')
    expect(g.textContent).toContain('Passion')
    expect(g.textContent).toContain('Mission')
    expect(g.textContent).toContain('Profession')
    expect(g.textContent).toContain('Vocation')
  })

  it('mounts into flowchart world once', () => {
    const root = document.createElement('div')
    root.innerHTML = `<svg><g class="vd-flowchart-world"></g></svg>`
    expect(ensureVennInWorld(root)).toBe(true)
    expect(root.querySelectorAll('.ikigai-venn')).toHaveLength(1)
    expect(ensureVennInWorld(root)).toBe(true)
    expect(root.querySelectorAll('.ikigai-venn')).toHaveLength(1)
  })
})
