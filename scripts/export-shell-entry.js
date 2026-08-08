import { createApp, h, nextTick, onMounted, onBeforeUnmount, ref } from 'vue'
import { VdFlowchart } from '@vanduo-oss/vd3-cbun/flowchart'
import { ensureVennInWorld } from '../src/lib/vennBackdrop.ts'
import { attachFlowchartToolbarTooltips } from '../src/lib/flowchartToolbarTooltips.ts'

function applyCategories(root, doc) {
  if (!root || !doc?.nodes) return
  for (const node of doc.nodes) {
    const category = node.data && node.data.category
    if (!category) continue
    const escape =
      typeof CSS !== 'undefined' && CSS.escape ? CSS.escape : (v) => String(v).replace(/"/g, '\\"')
    const el = root.querySelector('[data-node-id="' + escape(node.id) + '"]')
    if (el) el.setAttribute('data-category', category)
  }
}

const App = {
  setup() {
    const host = ref(null)
    let doc = window.__IKIGAI_DOCUMENT__
    if (typeof doc === 'string') {
      try {
        doc = JSON.parse(doc)
      } catch (_) {
        doc = null
      }
    }
    if (!doc || !Array.isArray(doc.nodes)) {
      doc = { version: '1.2.0', nodes: [], edges: [], viewport: { x: 0, y: 0, scale: 1 } }
    }

    let disposeTooltips = null

    function polish(instance) {
      nextTick(() => {
        ensureVennInWorld(host.value)
        applyCategories(host.value, instance && instance.toJSON ? instance.toJSON() : doc)
        try {
          instance && instance.fitView && instance.fitView()
        } catch (_) {}
        ensureVennInWorld(host.value)
        disposeTooltips && disposeTooltips()
        disposeTooltips = attachFlowchartToolbarTooltips(host.value)
      })
    }

    function onReady(instance) {
      // No radial layout — keep Venn composition.
      polish(instance)
    }

    function onChange(payload) {
      nextTick(() => {
        ensureVennInWorld(host.value)
        applyCategories(host.value, payload.document)
      })
    }

    onMounted(() => {
      nextTick(() => {
        ensureVennInWorld(host.value)
        applyCategories(host.value, doc)
      })
    })

    onBeforeUnmount(() => {
      disposeTooltips && disposeTooltips()
      disposeTooltips = null
    })

    return () =>
      h('div', { ref: host, style: 'height:100%' }, [
        h(VdFlowchart, {
          data: doc,
          autoFit: true,
          onReady,
          onChange,
        }),
      ])
  },
}

createApp(App).mount('#app')
