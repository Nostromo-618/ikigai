/**
 * Hover tooltips for VdFlowchart library toolbar buttons.
 *
 * Buttons are imperative DOM (`.vd-flowchart-btn[data-flowchart-action]`), so
 * wrapping with the Vue `VdTooltip` component is not practical. Instead we use
 * the same `data-tooltip` / `data-tooltip-placement` protocol that vd3's
 * `useTooltips` composable drives — floating `.vd-tooltip` bubbles on hover/focus.
 */

/** Labels verified against `@vanduo-oss/vd3-cbun` flowchart TOOLBAR_ACTIONS + clear. */
export const FLOWCHART_TOOLBAR_TOOLTIPS: Record<string, string> = {
  'zoom-out': 'Zoom out',
  'zoom-in': 'Zoom in',
  'reset-view': 'Reset view',
  'fit-view': 'Fit to view',
  undo: 'Undo',
  redo: 'Redo',
  clear: 'Clear canvas',
}

const TIP_SELECTOR = '[data-flowchart-action]'

function placeTip(trigger: HTMLElement, tip: HTMLElement, placement: string): void {
  const r = trigger.getBoundingClientRect()
  const t = tip.getBoundingClientRect()
  const gap = 8
  let top: number
  let left: number
  switch (placement) {
    case 'bottom':
      top = r.bottom + gap
      left = r.left + r.width / 2 - t.width / 2
      break
    case 'left':
      top = r.top + r.height / 2 - t.height / 2
      left = r.left - t.width - gap
      break
    case 'right':
      top = r.top + r.height / 2 - t.height / 2
      left = r.right + gap
      break
    default:
      top = r.top - t.height - gap
      left = r.left + r.width / 2 - t.width / 2
  }
  tip.style.top = `${Math.max(4, top)}px`
  tip.style.left = `${Math.max(4, left)}px`
}

/**
 * Mark toolbar icon buttons with vd3 tooltip attrs and wire hover/focus.
 * Returns a disposer (remove listeners + hide open tip). Safe to call again
 * after remounting the flowchart; dispose the previous return value first.
 */
export function attachFlowchartToolbarTooltips(root: ParentNode | null | undefined): () => void {
  if (!root) return () => {}

  let current: HTMLElement | null = null
  const cleanups: Array<() => void> = []

  const hide = (): void => {
    if (current) {
      current.remove()
      current = null
    }
  }

  const show = (trigger: HTMLElement): void => {
    hide()
    const text = trigger.getAttribute('data-tooltip')
    if (!text) return
    const placement = trigger.getAttribute('data-tooltip-placement') ?? 'bottom'
    const tip = document.createElement('div')
    tip.className = `vd-tooltip vd-tooltip-${placement}`
    tip.setAttribute('data-placement', placement)
    tip.style.position = 'fixed'
    tip.textContent = text
    document.body.appendChild(tip)
    placeTip(trigger, tip, placement)
    requestAnimationFrame(() => tip.classList.add('is-visible'))
    current = tip
  }

  root.querySelectorAll<HTMLElement>(TIP_SELECTOR).forEach((button) => {
    const action = button.getAttribute('data-flowchart-action')
    if (!action) return
    const label = FLOWCHART_TOOLBAR_TOOLTIPS[action] ?? button.getAttribute('aria-label')
    if (!label) return

    button.setAttribute('data-tooltip', label)
    button.setAttribute('data-tooltip-placement', 'bottom')

    const onEnter = (): void => show(button)
    const onLeave = (): void => hide()
    button.addEventListener('mouseenter', onEnter)
    button.addEventListener('mouseleave', onLeave)
    button.addEventListener('focus', onEnter)
    button.addEventListener('blur', onLeave)
    cleanups.push(() => {
      button.removeEventListener('mouseenter', onEnter)
      button.removeEventListener('mouseleave', onLeave)
      button.removeEventListener('focus', onEnter)
      button.removeEventListener('blur', onLeave)
    })
  })

  return () => {
    hide()
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
  }
}
