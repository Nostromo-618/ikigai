/**
 * Build a single-file interactive HTML shell for offline Ikigai exports.
 * Output: public/export-shell.html with __IKIGAI_DOCUMENT__ placeholder.
 */
import * as esbuild from 'esbuild'
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const require = createRequire(import.meta.url)

const entry = join(root, 'scripts/export-shell-entry.js')
const outJs = join(root, 'scripts/.export-shell-bundle.js')

mkdirSync(dirname(outJs), { recursive: true })

await esbuild.build({
  entryPoints: [entry],
  bundle: true,
  format: 'iife',
  globalName: 'IkigaiExport',
  outfile: outJs,
  platform: 'browser',
  target: ['es2020'],
  minify: true,
  legalComments: 'none',
})

const js = readFileSync(outJs, 'utf8')

function readPkgCss(specifier) {
  try {
    const resolved = require.resolve(specifier)
    return readFileSync(resolved, 'utf8')
  } catch {
    return ''
  }
}

const vdCore = readPkgCss('@vanduo-oss/vd3/css/core') || readPkgCss('@vanduo-oss/vd3/css')
const flowchartCss = readPkgCss('@vanduo-oss/vd3-cbun/flowchart/css')

const html = `<!DOCTYPE html>
<html lang="en" data-primary="red" data-neutral="slate" data-radius="0.25" data-font="system" data-theme="light">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<meta name="theme-color" content="#E3300B"/>
<title>Ikigai — interactive export</title>
<style>
${vdCore}
${flowchartCss}
html,html[data-primary]{--ik-brand:#e3300b;--vd-primary-5:var(--ik-brand);--vd-color-primary:var(--ik-brand);--vd-color-primary-hover:color-mix(in srgb,var(--ik-brand) 82%,black);--vd-color-accent:var(--ik-brand)}
html,body{margin:0;height:100%;background:var(--vd-bg-primary,#fcfbf7);color:var(--vd-text-primary,#1f2720);font-family:system-ui,sans-serif}
.wrap{display:flex;flex-direction:column;height:100vh}
.note{padding:.65rem 1rem;font-size:.85rem;border-bottom:1px solid var(--vd-border-color,#d5ccba);background:color-mix(in srgb,var(--vd-color-primary,#E3300B) 10%,transparent)}
#app{flex:1;min-height:0}
#app .vd-flowchart-host,#app .vd-flowchart{height:100%;min-height:100%}
.vd-flowchart-panel--inspector,.vd-flowchart-arrange,[data-flowchart-arrange]{display:none!important}
.vd-flowchart-body{grid-template-columns:88px minmax(0,1fr)!important;grid-template-rows:minmax(0,1fr)!important}
.vd-flowchart-palette-btn:not([data-node-type=rounded-rect]):not([data-node-type=circle]):not([data-node-type=diamond]){display:none!important}
.vd-flowchart-panel--palette{padding:.65rem .4rem;gap:.55rem}
.vd-flowchart-palette{grid-template-columns:1fr!important;gap:.4rem}
.vd-flowchart-palette-btn{min-height:3.35rem;padding:.35rem .15rem}
@media (max-width:840px){.vd-flowchart-panel--palette{border-right:1px solid var(--vd-flowchart-border,var(--vd-border-color));border-bottom:0}}
.vd-flowchart-node[data-category=love] .vd-flowchart-node-shape{fill:#f0d78a;stroke:#c9a227;stroke-width:2}
.vd-flowchart-node[data-category=goodAt] .vd-flowchart-node-shape{fill:#9fd4c8;stroke:#3d8f7f;stroke-width:2}
.vd-flowchart-node[data-category=worldNeeds] .vd-flowchart-node-shape{fill:#f0b0b0;stroke:#c45c5c;stroke-width:2}
.vd-flowchart-node[data-category=paidFor] .vd-flowchart-node-shape{fill:#a8d0e6;stroke:#4a8aad;stroke-width:2}
.ikigai-venn-pillar{fill:#1f2720;font-size:22px;font-weight:700}
.ikigai-venn-pair{fill:#1f2720;font-size:16px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
.ikigai-venn-center{fill:#f8f6f2;font-size:26px;font-weight:800;dominant-baseline:middle}
</style>
</head>
<body>
<div class="wrap">
  <div class="note">Standalone Ikigai export — interactive in this file. Does not sync with the website’s localStorage.</div>
  <div id="app"></div>
</div>
<script>
window.__IKIGAI_DOCUMENT__ = "__IKIGAI_DOCUMENT_JSON__";
${js}
</script>
</body>
</html>
`

const publicDir = join(root, 'public')
mkdirSync(publicDir, { recursive: true })
writeFileSync(join(publicDir, 'export-shell.html'), html, 'utf8')

const generated = join(root, 'src/generated')
mkdirSync(generated, { recursive: true })
writeFileSync(
  join(generated, 'export-shell-meta.ts'),
  `export const EXPORT_SHELL_BUILT = true\nexport const EXPORT_SHELL_BYTES = ${html.length}\n`,
  'utf8',
)

console.log(`export-shell.html written (${html.length} bytes)`)
