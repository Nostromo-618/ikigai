import type { FlowchartDocument } from '@vanduo-oss/vd3-cbun/flowchart'
import type { IkigaiCategory } from '@/content/types'

export const PILLAR_IDS = ['love', 'goodAt', 'worldNeeds', 'paidFor'] as const
export const INTERSECTION_IDS = ['passion', 'profession', 'vocation', 'mission'] as const

/** Shared coordinate space with the Venn backdrop (viewBox 0 0 1000 1000). */
export const VENN_VIEW = { width: 1000, height: 1000 } as const

export const VENN_CIRCLES = {
  love: { cx: 500, cy: 340, r: 265 },
  goodAt: { cx: 340, cy: 500, r: 265 },
  worldNeeds: { cx: 660, cy: 500, r: 265 },
  paidFor: { cx: 500, cy: 660, r: 265 },
} as const

function node(
  id: string,
  type: FlowchartDocument['nodes'][number]['type'],
  text: string,
  category: IkigaiCategory,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  return {
    id,
    type,
    x,
    y,
    width,
    height,
    text,
    data: { category },
  }
}

/**
 * Simplified seed: one example tile per outer lobe, parked in the tip so
 * pillar labels stay readable. Structural labels live on the Venn SVG.
 */
export const IKIGAI_SEED: FlowchartDocument = {
  version: '1.2.0',
  viewport: { x: 0, y: 0, scale: 1 },
  nodes: [
    // Love tip (top) — above “What you love”
    node('tile-love-1', 'rounded-rect', 'example: Writing product reviews', 'love', 385, 78, 230, 48),
    // Good-at tip (left) — left of “What you are good at”
    node('tile-good-1', 'rounded-rect', 'example: Debugging legacy software', 'goodAt', 42, 455, 230, 48),
    // World-needs tip (right) — right of “What the world needs”
    node('tile-world-1', 'rounded-rect', 'example: Youth STEM mentorship', 'worldNeeds', 728, 455, 230, 48),
    // Paid-for tip (bottom) — below “What you can be paid for”
    node('tile-paid-1', 'rounded-rect', 'example: Freelance copywriting', 'paidFor', 385, 900, 230, 48),
  ],
  edges: [],
}

export function cloneSeed(): FlowchartDocument {
  return structuredClone(IKIGAI_SEED)
}

export function isValidDocument(value: unknown): value is FlowchartDocument {
  if (!value || typeof value !== 'object') return false
  const doc = value as Partial<FlowchartDocument>
  if (!Array.isArray(doc.nodes) || !Array.isArray(doc.edges)) return false
  if (doc.nodes.length > 10_000 || doc.edges.length > 10_000) return false
  const ids = new Set<string>()
  for (const n of doc.nodes) {
    if (!n || typeof n !== 'object') return false
    if (typeof n.id !== 'string' || !n.id) return false
    if (ids.has(n.id)) return false
    ids.add(n.id)
  }
  return true
}

/** Seed / saved maps should cover all four pillar categories via tiles or hubs. */
export function hasPillars(doc: FlowchartDocument): boolean {
  const cats = new Set(
    doc.nodes
      .map((n) => n.data?.category)
      .filter((c): c is string => typeof c === 'string'),
  )
  return (PILLAR_IDS as readonly string[]).every((id) => cats.has(id))
}
