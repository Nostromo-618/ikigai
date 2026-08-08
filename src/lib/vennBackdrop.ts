import { VENN_CIRCLES, VENN_VIEW } from '@/data/ikigaiSeed'

const SVG_NS = 'http://www.w3.org/2000/svg'

function el(name: string, attrs: Record<string, string | number> = {}): SVGElement {
  const node = document.createElementNS(SVG_NS, name)
  for (const [k, v] of Object.entries(attrs)) {
    node.setAttribute(k, String(v))
  }
  return node
}

function text(
  content: string,
  attrs: Record<string, string | number>,
  className: string,
): SVGTextElement {
  const t = el('text', attrs) as SVGTextElement
  t.setAttribute('class', className)
  t.textContent = content
  return t
}

/** Build the classic 4-circle Ikigai Venn as an SVG group in flowchart world space. */
export function createVennGroup(): SVGGElement {
  const g = el('g', { class: 'ikigai-venn', 'pointer-events': 'none' }) as SVGGElement

  const defs = el('defs')
  // Soft pastel fills (translucent)
  const colors: Record<string, string> = {
    love: 'rgba(232, 196, 104, 0.42)',
    goodAt: 'rgba(110, 184, 168, 0.42)',
    worldNeeds: 'rgba(232, 140, 140, 0.40)',
    paidFor: 'rgba(125, 186, 214, 0.42)',
  }
  for (const [key, fill] of Object.entries(colors)) {
    const c = VENN_CIRCLES[key as keyof typeof VENN_CIRCLES]
    defs.appendChild(
      el('circle', {
        id: `ikigai-venn-${key}`,
        cx: c.cx,
        cy: c.cy,
        r: c.r,
        fill,
      }),
    )
  }
  g.appendChild(defs)

  // Draw circles (order: back to front)
  for (const key of ['love', 'goodAt', 'worldNeeds', 'paidFor'] as const) {
    const c = VENN_CIRCLES[key]
    g.appendChild(
      el('circle', {
        class: `ikigai-venn-circle ikigai-venn-circle--${key}`,
        cx: c.cx,
        cy: c.cy,
        r: c.r,
        fill: colors[key],
        stroke: 'rgba(255,255,255,0.55)',
        'stroke-width': 2,
      }),
    )
  }

  // Pillar labels (outer lobes)
  g.appendChild(
    text('What you love', { x: 500, y: 175, 'text-anchor': 'middle' }, 'ikigai-venn-pillar'),
  )
  g.appendChild(
    text('What you are good at', { x: 175, y: 505, 'text-anchor': 'middle' }, 'ikigai-venn-pillar'),
  )
  g.appendChild(
    text('What the world needs', { x: 825, y: 505, 'text-anchor': 'middle' }, 'ikigai-venn-pillar'),
  )
  g.appendChild(
    text('What you can be paid for', { x: 500, y: 845, 'text-anchor': 'middle' }, 'ikigai-venn-pillar'),
  )

  // Pairwise intersection labels
  g.appendChild(
    text('Passion', { x: 355, y: 355, 'text-anchor': 'middle' }, 'ikigai-venn-pair'),
  )
  g.appendChild(
    text('Mission', { x: 645, y: 355, 'text-anchor': 'middle' }, 'ikigai-venn-pair'),
  )
  g.appendChild(
    text('Profession', { x: 355, y: 665, 'text-anchor': 'middle' }, 'ikigai-venn-pair'),
  )
  g.appendChild(
    text('Vocation', { x: 645, y: 665, 'text-anchor': 'middle' }, 'ikigai-venn-pair'),
  )

  // Center Ikigai (strongest)
  g.appendChild(
    el('ellipse', {
      class: 'ikigai-venn-center-shape',
      cx: 500,
      cy: 500,
      rx: 58,
      ry: 42,
      fill: 'rgba(55, 48, 40, 0.88)',
    }),
  )
  g.appendChild(
    text('Ikigai', { x: 500, y: 508, 'text-anchor': 'middle' }, 'ikigai-venn-center'),
  )

  // Invisible bounds helper for fit (matches view)
  g.appendChild(
    el('rect', {
      x: 0,
      y: 0,
      width: VENN_VIEW.width,
      height: VENN_VIEW.height,
      fill: 'transparent',
      'pointer-events': 'none',
    }),
  )

  return g
}

/** Ensure Venn exists as the first child of `.vd-flowchart-world` so it pans/zooms with nodes. */
export function ensureVennInWorld(root: ParentNode | null | undefined): boolean {
  if (!root) return false
  const world = root.querySelector('.vd-flowchart-world')
  if (!(world instanceof SVGGElement)) return false
  let venn = world.querySelector('.ikigai-venn')
  if (venn) return true
  venn = createVennGroup()
  world.insertBefore(venn, world.firstChild)
  return true
}
