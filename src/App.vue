<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { onMounted } from 'vue'
import SiteNav from '@/components/SiteNav.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import DisclaimerGate from '@/components/DisclaimerGate.vue'
import FarewellScreen from '@/components/FarewellScreen.vue'
import { SITE } from '@/data/site'
import { useDisclaimerConsent } from '@/composables/useDisclaimerConsent'

useHead({
  htmlAttrs: { lang: 'en' },
  meta: [{ name: 'theme-color', content: SITE.brandColor }],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: `${import.meta.env.BASE_URL}favicon.svg` }],
})

const { showGate, showFarewell, accepted, accept, decline, reopenGate, refresh } =
  useDisclaimerConsent()

onMounted(() => {
  refresh()
})

void SITE
</script>

<template>
  <div class="app-shell" :class="{ 'is-consent-locked': showGate || showFarewell }">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <SiteNav />
    <main id="main-content" class="app-main" :aria-hidden="showGate || showFarewell ? 'true' : undefined">
      <RouterView v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="route.path" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />

    <DisclaimerGate v-if="showGate" @accept="accept" @decline="decline" />
    <FarewellScreen v-else-if="showFarewell" @reread="reopenGate" />
  </div>
</template>
