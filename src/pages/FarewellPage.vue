<script setup lang="ts">
import { useRouter } from 'vue-router'
import { FAREWELL_BODY, FAREWELL_TITLE } from '@/content/disclaimer'
import { useDisclaimerConsent } from '@/composables/useDisclaimerConsent'
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Farewell',
  description: 'You declined the site terms. Re-read the disclaimer when you are ready to continue.',
  path: '/farewell',
  robots: 'noindex, nofollow',
})

const router = useRouter()
const { reopenGate } = useDisclaimerConsent()

function onReread() {
  reopenGate()
  void router.replace('/')
}
</script>

<template>
  <div class="farewell-page" data-testid="disclaimer-farewell">
    <div class="farewell-page-inner">
      <i class="ph ph-hand-waving farewell-icon" aria-hidden="true"></i>
      <h1 id="farewell-title">{{ FAREWELL_TITLE }}</h1>
      <p>{{ FAREWELL_BODY }}</p>
      <div class="farewell-actions">
        <button
          type="button"
          class="vd-btn vd-btn-primary"
          data-testid="disclaimer-reread"
          @click="onReread"
        >
          Re-read the disclaimer
        </button>
      </div>
    </div>
  </div>
</template>
