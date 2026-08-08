import type { FlowchartDocument } from '@vanduo-oss/vd3-cbun/flowchart'

export const HTML_DOC_PLACEHOLDER = '"__IKIGAI_DOCUMENT_JSON__"'

/**
 * Inject a flowchart document into a prebuilt single-file shell.
 * The shell is generated at build time by scripts/build-export-shell.mjs.
 */
export function injectDocumentIntoShell(shellHtml: string, doc: FlowchartDocument): string {
  if (!shellHtml.includes(HTML_DOC_PLACEHOLDER)) {
    throw new Error('Export shell missing document placeholder')
  }
  const json = JSON.stringify(doc).replace(/</g, '\\u003c')
  return shellHtml.split(HTML_DOC_PLACEHOLDER).join(json)
}

export async function loadExportShell(): Promise<string> {
  const base = import.meta.env.BASE_URL || '/'
  const url = `${base}export-shell.html`
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`Failed to load export shell (${res.status})`)
  }
  return res.text()
}

export async function buildInteractiveHtml(doc: FlowchartDocument): Promise<string> {
  const shell = await loadExportShell()
  return injectDocumentIntoShell(shell, doc)
}
