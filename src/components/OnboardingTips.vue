<script setup lang="ts">
import { ref } from 'vue'
import { western } from '@/content/western'

const emit = defineEmits<{ done: [] }>()
const step = ref(0)
const tips = western.tooltips

function next() {
  if (step.value >= tips.length - 1) {
    emit('done')
    return
  }
  step.value += 1
}

function skip() {
  emit('done')
}
</script>

<template>
  <div class="onboarding" data-testid="onboarding" role="dialog" aria-label="Map tips">
    <h3>{{ tips[step].heading }}</h3>
    <p>{{ tips[step].text }}</p>
    <div class="onboarding-actions">
      <button type="button" class="vd-btn vd-btn-ghost-primary vd-btn-sm" @click="skip">Skip</button>
      <button type="button" class="vd-btn vd-btn-primary vd-btn-sm" @click="next">
        {{ step >= tips.length - 1 ? 'Start mapping' : 'Next' }}
      </button>
    </div>
  </div>
</template>
