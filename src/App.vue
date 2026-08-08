<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import SiteNav from '@/components/SiteNav.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import DisclaimerGate from '@/components/DisclaimerGate.vue'
import { SITE } from '@/data/site'
import { useDisclaimerConsent } from '@/composables/useDisclaimerConsent'

useHead({
  htmlAttrs: { lang: 'en' },
  meta: [{ name: 'theme-color', content: SITE.brandColor }],
  link: [{ rel: 'icon', type: 'image/svg+xml', href: `${import.meta.env.BASE_URL}favicon.svg` }],
})

const route = useRoute()
const router = useRouter()
const { showGate, showFarewell, accept, decline, refresh } = useDisclaimerConsent()

const isFarewellRoute = computed(() => route.name === 'farewell' || route.path === '/farewell')

function goFarewell() {
  if (!isFarewellRoute.value) {
    void router.replace({ name: 'farewell' })
  }
}

function onDecline() {
  decline()
  goFarewell()
}

function onAccept() {
  accept()
}

onMounted(() => {
  refresh()
  if (showFarewell.value) goFarewell()
})

watch(showFarewell, (declined) => {
  if (declined) goFarewell()
})

void SITE
</script>

<template>
  <div
    class="app-shell"
    :class="{
      'is-consent-locked': showGate,
      'is-farewell': isFarewellRoute,
    }"
  >
    <template v-if="!isFarewellRoute">
      <a href="#main-content" class="skip-link">Skip to content</a>
      <SiteNav />
      <main id="main-content" class="app-main" :aria-hidden="showGate ? 'true' : undefined">
        <RouterView v-slot="{ Component, route: viewRoute }">
          <Transition name="fade" mode="out-in">
            <component :is="Component" :key="viewRoute.path" />
          </Transition>
        </RouterView>
      </main>
      <SiteFooter />
    </template>

    <main v-else id="main-content" class="app-main app-main--farewell">
      <RouterView v-slot="{ Component, route: viewRoute }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" :key="viewRoute.path" />
        </Transition>
      </RouterView>
    </main>

    <DisclaimerGate v-if="showGate" @accept="onAccept" @decline="onDecline" />
  </div>
</template>
