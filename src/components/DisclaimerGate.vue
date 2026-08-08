<script setup lang="ts">
import {
  DISCLAIMER_INTRO,
  DISCLAIMER_SECTIONS,
  DISCLAIMER_TITLE,
} from '@/content/disclaimer'
import { DISCLAIMER_VERSION } from '@/data/site'

defineEmits<{
  accept: []
  decline: []
}>()
</script>

<template>
  <div
    class="consent-overlay"
    data-testid="disclaimer-gate"
    role="dialog"
    aria-modal="true"
    aria-labelledby="disclaimer-gate-title"
  >
    <div class="consent-panel">
      <header class="consent-header">
        <h1 id="disclaimer-gate-title">{{ DISCLAIMER_TITLE }}</h1>
        <p class="consent-version">Terms version {{ DISCLAIMER_VERSION }}</p>
        <p>{{ DISCLAIMER_INTRO }}</p>
      </header>

      <div class="consent-body">
        <section v-for="section in DISCLAIMER_SECTIONS" :key="section.heading" class="consent-section">
          <h2>{{ section.heading }}</h2>
          <p>{{ section.body }}</p>
        </section>
      </div>

      <footer class="consent-actions">
        <button
          type="button"
          class="vd-btn vd-btn-ghost-primary"
          data-testid="disclaimer-decline"
          @click="$emit('decline')"
        >
          I do not accept
        </button>
        <button
          type="button"
          class="vd-btn vd-btn-primary"
          data-testid="disclaimer-accept"
          @click="$emit('accept')"
        >
          I understand and accept
        </button>
      </footer>
    </div>
  </div>
</template>
