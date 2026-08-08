const STYLE_PROPS = [
  'fill',
  'stroke',
  'stroke-width',
  'stroke-opacity',
  'fill-opacity',
  'opacity',
  'font-family',
  'font-size',
  'font-weight',
  'color',
] as const

function inlineStyles(source: Element, clone: Element): void {
  if (source instanceof SVGElement && clone instanceof SVGElement) {
    const cs = getComputedStyle(source)
    for (const prop of STYLE_PROPS) {
      const value = cs.getPropertyValue(prop)
      if (value && value !== 'none' && value !== '') {
        clone.setAttribute(prop, value.trim())
      }
    }
  }
  const sourceChildren = Array.from(source.children)
  const cloneChildren = Array.from(clone.children)
  for (let i = 0; i < sourceChildren.length; i += 1) {
    const s = sourceChildren[i]
    const c = cloneChildren[i]
    if (s && c) inlineStyles(s, c)
  }
}

function stripChrome(svg: SVGElement): void {
  svg
    .querySelectorAll(
      '.vd-flowchart-port-group, .vd-flowchart-resize-controls, .vd-flowchart-preview, .vd-flowchart-overlay, .vd-flowchart-grid, pattern',
    )
    .forEach((el) => el.remove())
  svg.querySelectorAll('.is-selected').forEach((el) => el.classList.remove('is-selected'))
  // Keep `.ikigai-venn` — it is the primary diagram backdrop.
}

export interface SvgExportOptions {
  padding?: number
  background?: string
}

export function serializeFlowchartSvg(
  host: Element,
  options: SvgExportOptions = {},
): string {
  const padding = options.padding ?? 24
  const background = options.background ?? '#ffffff'
  const sourceSvg = host.querySelector('svg.vd-flowchart-svg')
  if (!(sourceSvg instanceof SVGSVGElement)) {
    throw new Error('Flowchart SVG not found')
  }

  const clone = sourceSvg.cloneNode(true) as SVGSVGElement
  inlineStyles(sourceSvg, clone)
  stripChrome(clone)

  const world = clone.querySelector('.vd-flowchart-world') as SVGGElement | null
  const nodes = world?.querySelectorAll('.vd-flowchart-node') ?? []
  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  nodes.forEach((node) => {
    const transform = node.getAttribute('transform') || ''
    const match = /translate\(([-\d.]+)[,\s]+([-\d.]+)\)/.exec(transform)
    const x = match ? Number(match[1]) : 0
    const y = match ? Number(match[2]) : 0
    const hit = node.querySelector('rect')
    const w = hit ? Number(hit.getAttribute('width') || 100) : 100
    const h = hit ? Number(hit.getAttribute('height') || 60) : 60
    minX = Math.min(minX, x)
    minY = Math.min(minY, y)
    maxX = Math.max(maxX, x + w)
    maxY = Math.max(maxY, y + h)
  })

  // Include Venn frame when present
  const vennCircles = clone.querySelectorAll('.ikigai-venn-circle')
  vennCircles.forEach((circle) => {
    const cx = Number(circle.getAttribute('cx') || 0)
    const cy = Number(circle.getAttribute('cy') || 0)
    const r = Number(circle.getAttribute('r') || 0)
    minX = Math.min(minX, cx - r)
    minY = Math.min(minY, cy - r)
    maxX = Math.max(maxX, cx + r)
    maxY = Math.max(maxY, cy + r)
  })

  if (!Number.isFinite(minX)) {
    minX = 0
    minY = 0
    maxX = 1000
    maxY = 1000
  }

  const vbX = minX - padding
  const vbY = minY - padding
  const vbW = Math.max(1, maxX - minX + padding * 2)
  const vbH = Math.max(1, maxY - minY + padding * 2)

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clone.setAttribute('width', String(Math.round(vbW)))
  clone.setAttribute('height', String(Math.round(vbH)))
  clone.setAttribute('viewBox', `${vbX} ${vbY} ${vbW} ${vbH}`)

  // Remove host viewport transform for a clean export
  if (world) {
    world.removeAttribute('transform')
  }

  const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  bg.setAttribute('x', String(vbX))
  bg.setAttribute('y', String(vbY))
  bg.setAttribute('width', String(vbW))
  bg.setAttribute('height', String(vbH))
  bg.setAttribute('fill', background)
  clone.insertBefore(bg, clone.firstChild)

  return new XMLSerializer().serializeToString(clone)
}
