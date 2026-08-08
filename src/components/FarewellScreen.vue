<script setup lang="ts">
import { FAREWELL_BODY, FAREWELL_TITLE } from '@/content/disclaimer'

defineEmits<{
  reread: []
}>()
</script>

<template>
  <div
    class="consent-overlay farewell"
    data-testid="disclaimer-farewell"
    role="dialog"
    aria-modal="true"
    aria-labelledby="farewell-title"
  >
    <div class="consent-panel consent-panel--narrow">
      <h1 id="farewell-title">{{ FAREWELL_TITLE }}</h1>
      <p>{{ FAREWELL_BODY }}</p>
      <div class="consent-actions">
        <RouterLink class="vd-btn vd-btn-ghost-primary" to="/read">Browse topics</RouterLink>
        <button
          type="button"
          class="vd-btn vd-btn-primary"
          data-testid="disclaimer-reread"
          @click="$emit('reread')"
        >
          Re-read the disclaimer
        </button>
      </div>
    </div>
  </div>
</template>
