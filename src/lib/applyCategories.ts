import type { FlowchartDocument } from '@vanduo-oss/vd3-cbun/flowchart'

function escapeAttr(value: string): string {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value)
  }
  return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

/** Apply data-category from node.data onto SVG groups for CSS coloring. */
export function applyCategories(
  root: ParentNode | null | undefined,
  doc: Pick<FlowchartDocument, 'nodes'>,
): number {
  if (!root) return 0
  let applied = 0
  for (const node of doc.nodes) {
    const category = node.data?.category
    if (typeof category !== 'string' || !category) continue
    const el = root.querySelector(`[data-node-id="${escapeAttr(node.id)}"]`)
    if (el instanceof Element) {
      el.setAttribute('data-category', category)
      applied += 1
    }
  }
  return applied
}
