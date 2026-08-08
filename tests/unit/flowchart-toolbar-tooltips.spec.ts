import { afterEach, describe, expect, it } from 'vitest'
import {
  FLOWCHART_TOOLBAR_TOOLTIPS,
  attachFlowchartToolbarTooltips,
} from '@/lib/flowchartToolbarTooltips'

describe('FLOWCHART_TOOLBAR_TOOLTIPS', () => {
  it('covers the icon-strip actions from vd3-cbun flowchart', () => {
    expect(FLOWCHART_TOOLBAR_TOOLTIPS).toEqual({
      'zoom-out': 'Zoom out',
      'zoom-in': 'Zoom in',
      'reset-view': 'Reset view',
      'fit-view': 'Fit to view',
      undo: 'Undo',
      redo: 'Redo',
      clear: 'Clear canvas',
    })
  })
})

describe('attachFlowchartToolbarTooltips', () => {
  afterEach(() => {
    document.body.querySelectorAll('.vd-tooltip').forEach((el) => el.remove())
  })

  it('sets data-tooltip below on each flowchart action button', () => {
    const root = document.createElement('div')
    root.innerHTML = `
      <button type="button" data-flowchart-action="zoom-out" aria-label="Zoom out"></button>
      <button type="button" data-flowchart-action="fit-view" aria-label="Fit view"></button>
      <button type="button" data-flowchart-action="clear" aria-label="Clear canvas"></button>
      <button type="button" data-flowchart-arrange></button>
    `
    const dispose = attachFlowchartToolbarTooltips(root)

    const zoom = root.querySelector('[data-flowchart-action="zoom-out"]')!
    expect(zoom.getAttribute('data-tooltip')).toBe('Zoom out')
    expect(zoom.getAttribute('data-tooltip-placement')).toBe('bottom')

    const fit = root.querySelector('[data-flowchart-action="fit-view"]')!
    expect(fit.getAttribute('data-tooltip')).toBe('Fit to view')

    const clear = root.querySelector('[data-flowchart-action="clear"]')!
    expect(clear.getAttribute('data-tooltip')).toBe('Clear canvas')

    expect(root.querySelector('[data-flowchart-arrange]')!.hasAttribute('data-tooltip')).toBe(
      false,
    )

    dispose()
  })

  it('shows a vd-tooltip on mouseenter and cleans up on dispose', () => {
    const root = document.createElement('div')
    const button = document.createElement('button')
    button.setAttribute('data-flowchart-action', 'undo')
    button.setAttribute('aria-label', 'Undo')
    root.appendChild(button)
    document.body.appendChild(root)

    const dispose = attachFlowchartToolbarTooltips(root)
    button.dispatchEvent(new Event('mouseenter'))

    const tip = document.body.querySelector('.vd-tooltip')
    expect(tip).toBeTruthy()
    expect(tip?.textContent).toBe('Undo')
    expect(tip?.classList.contains('vd-tooltip-bottom')).toBe(true)

    dispose()
    expect(document.body.querySelector('.vd-tooltip')).toBeNull()
    root.remove()
  })
})
