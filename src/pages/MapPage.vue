<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import { VdFlowchart } from '@vanduo-oss/vd3-cbun/flowchart'
import type {
  FlowchartChangeEvent,
  FlowchartDocument,
  VdFlowchartCore,
  VdFlowchartDocument,
} from '@vanduo-oss/vd3-cbun/flowchart'
import { useSeo } from '@/composables/useSeo'
import { useDisclaimerConsent } from '@/composables/useDisclaimerConsent'
import { cloneSeed, VENN_VIEW } from '@/data/ikigaiSeed'
import { applyCategories } from '@/lib/applyCategories'
import { ensureVennInWorld } from '@/lib/vennBackdrop'
import { attachFlowchartToolbarTooltips } from '@/lib/flowchartToolbarTooltips'
import {
  clearDocument,
  isOnboardingDone,
  loadDocument,
  saveDocument,
  setOnboardingDone,
} from '@/lib/storage'
import { downloadBlob, downloadText } from '@/lib/export/download'
import { serializeFlowchartSvg } from '@/lib/export/svg'
import { exportFlowchartPng } from '@/lib/export/png'
import { buildInteractiveHtml } from '@/lib/export/html'
import { western } from '@/content/western'
import PrivacyReminder from '@/components/PrivacyReminder.vue'
import OnboardingTips from '@/components/OnboardingTips.vue'

useSeo({
  title: 'Interactive map',
  description:
    'Build and rearrange a colorful Ikigai Venn map. Tiles save privately in this browser.',
  path: '/map',
})

const { accepted } = useDisclaimerConsent()

const ready = ref(false)
const fullscreen = ref(false)
const showOnboarding = ref(false)
const exportError = ref('')
const statusMessage = ref('')
const doc = shallowRef<FlowchartDocument>(cloneSeed())
const initialData = shallowRef<VdFlowchartDocument>(cloneSeed() as unknown as VdFlowchartDocument)
const chartKey = ref(0)
const hostEl = ref<HTMLElement | null>(null)
const editor = shallowRef<VdFlowchartCore | null>(null)
const didInitialFit = ref(false)

let saveTimer: ReturnType<typeof setTimeout> | null = null
let disposeToolbarTooltips: (() => void) | null = null

const isEmpty = computed(() => (doc.value.nodes?.length ?? 0) === 0)
const canInteract = computed(() => accepted.value)

function bindToolbarTooltips() {
  disposeToolbarTooltips?.()
  disposeToolbarTooltips = attachFlowchartToolbarTooltips(hostEl.value)
}

function refreshCategories(source?: FlowchartDocument) {
  const root = hostEl.value
  const current = source ?? doc.value
  if (!root || !current) return
  applyCategories(root, current)
}

function mountVenn() {
  ensureVennInWorld(hostEl.value)
}

function fitToVenn(instance: VdFlowchartCore) {
  // Prefer content fit; then nudge to include the full Venn frame.
  instance.setViewport?.({
    x: 40,
    y: 20,
    scale: 0.72,
  })
  // If setViewport missing, fall back
  if (!instance.setViewport) {
    instance.fitView?.()
  }
  void VENN_VIEW
}

function onReady(instance: VdFlowchartCore) {
  editor.value = instance
  nextTick(() => {
    mountVenn()
    refreshCategories(instance.toJSON?.() ?? doc.value)
    bindToolbarTooltips()
    if (!didInitialFit.value) {
      didInitialFit.value = true
      // Do NOT layout('radial') — it destroys the Venn composition.
      fitToVenn(instance)
      nextTick(() => {
        mountVenn()
        instance.fitView?.()
        mountVenn()
      })
    }
  })
}

function onChange(payload: FlowchartChangeEvent) {
  doc.value = payload.document
  nextTick(() => {
    mountVenn()
    refreshCategories(payload.document)
  })
  if (!canInteract.value) return
  if (saveTimer) clearTimeout(saveTimer)
  saveTimer = setTimeout(() => {
    saveDocument(payload.document)
  }, 250)
}

function finishOnboarding() {
  setOnboardingDone()
  showOnboarding.value = false
}

function resetMap() {
  if (!window.confirm('Reset your map to the starter Ikigai diagram? This cannot be undone.')) {
    return
  }
  clearDocument()
  const seed = cloneSeed()
  doc.value = seed
  didInitialFit.value = false
  initialData.value = seed as unknown as VdFlowchartDocument
  chartKey.value += 1
  statusMessage.value = 'Map reset to the starter diagram.'
}

function exportBackground(): string {
  const theme = document.documentElement.getAttribute('data-theme')
  return theme === 'dark' ? '#0f172a' : '#f7f5f1'
}

async function doExportSvg() {
  exportError.value = ''
  try {
    if (!hostEl.value) throw new Error('Map not ready')
    mountVenn()
    const markup = serializeFlowchartSvg(hostEl.value, { background: exportBackground() })
    downloadText(markup, 'ikigai-map.svg', 'image/svg+xml;charset=utf-8')
    statusMessage.value = 'SVG downloaded.'
  } catch (err) {
    exportError.value = err instanceof Error ? err.message : 'SVG export failed'
  }
}

async function doExportPng() {
  exportError.value = ''
  try {
    if (!hostEl.value) throw new Error('Map not ready')
    mountVenn()
    const blob = await exportFlowchartPng(hostEl.value, {
      scale: 2,
      background: exportBackground(),
    })
    downloadBlob(blob, 'ikigai-map.png')
    statusMessage.value = 'PNG downloaded.'
  } catch (err) {
    exportError.value = err instanceof Error ? err.message : 'PNG export failed'
  }
}

async function doExportHtml() {
  exportError.value = ''
  try {
    const current = editor.value?.toJSON?.() ?? doc.value
    const html = await buildInteractiveHtml(current)
    downloadText(html, 'ikigai-live.html', 'text/html;charset=utf-8')
    statusMessage.value = 'Interactive HTML downloaded.'
  } catch (err) {
    exportError.value = err instanceof Error ? err.message : 'HTML export failed'
  }
}

function toggleFullscreen() {
  fullscreen.value = !fullscreen.value
  nextTick(() => {
    editor.value?.fitView?.()
    mountVenn()
  })
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && fullscreen.value) fullscreen.value = false
}

function bootMap() {
  if (!canInteract.value) {
    ready.value = false
    return
  }
  const stored = loadDocument()
  doc.value = stored
  initialData.value = stored as unknown as VdFlowchartDocument
  showOnboarding.value = !isOnboardingDone()
  ready.value = true
}

onMounted(() => {
  bootMap()
  window.addEventListener('keydown', onKeydown)
})

watch(accepted, (ok) => {
  if (ok) bootMap()
  else ready.value = false
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  if (saveTimer) clearTimeout(saveTimer)
  disposeToolbarTooltips?.()
  disposeToolbarTooltips = null
})
</script>

<template>
  <div class="map-page">
    <div class="container">
      <header class="page-header">
        <h1>Your Ikigai map</h1>
        <p>
          Four overlapping circles — love, skill, need, and livelihood. Drag and edit the small
          tiles; the Venn stays your calm first look. Changes save in this browser after you accept
          the site terms.
        </p>
      </header>

      <div v-if="!canInteract" class="disclaimer" data-testid="map-locked" role="status">
        <p>
          The interactive map stays locked until you accept the disclaimer. Use the dialog above,
          or decline and re-read the terms when you are ready.
        </p>
      </div>

      <template v-else>
        <PrivacyReminder />

        <div class="map-toolbar" role="toolbar" aria-label="Map actions">
          <button type="button" class="vd-btn vd-btn-primary vd-btn-sm" data-testid="export-png" @click="doExportPng">
            <i class="ph ph-image" aria-hidden="true"></i> Export PNG
          </button>
          <button type="button" class="vd-btn vd-btn-sm" data-testid="export-svg" @click="doExportSvg">
            <i class="ph ph-file-svg" aria-hidden="true"></i> Export SVG
          </button>
          <button type="button" class="vd-btn vd-btn-sm" data-testid="export-html" @click="doExportHtml">
            <i class="ph ph-code" aria-hidden="true"></i> Export HTML
          </button>
          <button type="button" class="vd-btn vd-btn-ghost-primary vd-btn-sm" data-testid="reset-map" @click="resetMap">
            <i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i> Reset map
          </button>
          <button
            type="button"
            class="vd-btn vd-btn-ghost-primary vd-btn-sm"
            :aria-pressed="fullscreen"
            @click="toggleFullscreen"
          >
            <i :class="fullscreen ? 'ph ph-arrows-in' : 'ph ph-arrows-out'" aria-hidden="true"></i>
            {{ fullscreen ? 'Exit full screen' : 'Full screen' }}
          </button>
        </div>

        <p v-if="statusMessage" class="empty-hint" role="status">{{ statusMessage }}</p>
        <p v-if="exportError" class="empty-hint" role="alert" style="color: var(--ik-love)">
          {{ exportError }}
        </p>
        <p v-if="isEmpty" class="empty-hint">{{ western.emptyStates.blank }}</p>

        <div
          ref="hostEl"
          class="map-stage map-stage--venn"
          :class="{ 'is-fullscreen': fullscreen }"
          data-testid="map-stage"
        >
          <OnboardingTips v-if="showOnboarding && ready" @done="finishOnboarding" />
          <VdFlowchart
            v-if="ready"
            :key="chartKey"
            :data="initialData"
            auto-fit
            @ready="onReady"
            @change="onChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>
