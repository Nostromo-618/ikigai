<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { VdNavbar, VdThemeSwitcher } from '@vanduo-oss/vd3'
import { NAV, SITE } from '@/data/site'

const route = useRoute()
const navbarRef = ref<{ close: (returnFocus?: boolean) => void; isOpen: boolean } | null>(null)

const isActive = (to: string): boolean => {
  if (to === '/') return route.path === '/'
  return route.path === to || route.path.startsWith(`${to}/`)
}

/** Blur before VdNavbar closes the menu so focus isn't left under aria-hidden. */
function blurNavLink(event: Event) {
  const target = event.currentTarget
  if (target instanceof HTMLElement) target.blur()
}

function releaseNavbarFocus() {
  const active = document.activeElement
  if (active instanceof HTMLElement && active.closest('.ik-nav .vd-navbar-menu')) {
    active.blur()
  }
  navbarRef.value?.close()
}

/**
 * VdNavbar binds aria-hidden to mobile drawer open state even at desktop widths,
 * where the menu stays visible. Keep it exposed to AT outside the drawer.
 */
function syncDesktopMenuAria() {
  const menu = document.querySelector('.ik-nav .vd-navbar-menu')
  if (!(menu instanceof HTMLElement)) return
  if (window.matchMedia('(max-width: 991.98px)').matches) return
  if (menu.getAttribute('aria-hidden') === 'false') return
  menu.setAttribute('aria-hidden', 'false')
}

watch(() => route.fullPath, releaseNavbarFocus)

watch(
  () => navbarRef.value?.isOpen,
  async () => {
    await nextTick()
    syncDesktopMenuAria()
  },
)

let menuObserver: MutationObserver | undefined

onMounted(() => {
  syncDesktopMenuAria()
  window.addEventListener('resize', syncDesktopMenuAria)

  const menu = document.querySelector('.ik-nav .vd-navbar-menu')
  if (menu) {
    menuObserver = new MutationObserver(syncDesktopMenuAria)
    menuObserver.observe(menu, { attributes: true, attributeFilter: ['aria-hidden'] })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', syncDesktopMenuAria)
  menuObserver?.disconnect()
})
</script>

<template>
  <VdNavbar ref="navbarRef" variant="glass" position="fixed" class="ik-nav">
    <template #brand>
      <RouterLink to="/" class="brand" :aria-label="SITE.name">
        <i class="ph-fill ph-circles-three brand-mark" aria-hidden="true"></i>
        <span class="brand-name">{{ SITE.name }}</span>
      </RouterLink>
    </template>

    <ul class="vd-navbar-nav">
      <li>
        <RouterLink
          to="/"
          class="vd-nav-link"
          :class="{ 'vd-active': isActive('/') }"
          @click="blurNavLink"
        >
          Home
        </RouterLink>
      </li>
      <li v-for="item in NAV" :key="item.to">
        <RouterLink
          :to="item.to"
          class="vd-nav-link"
          :class="{ 'vd-active': isActive(item.to) }"
          @click="blurNavLink"
        >
          {{ item.label }}
        </RouterLink>
      </li>
    </ul>

    <template #actions>
      <div class="nav-actions">
        <VdThemeSwitcher align="end" />
      </div>
    </template>
  </VdNavbar>
</template>
