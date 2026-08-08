<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'

useSeo({
  title: 'Not found',
  description: 'This page does not exist.',
  path: '/404',
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="container page-header">
    <h1>Page not found</h1>
    <p>That route does not exist on this site.</p>
    <div class="hero-actions" style="margin-top: 1.5rem">
      <RouterLink class="vd-btn vd-btn-primary" to="/">Home</RouterLink>
      <RouterLink class="vd-btn vd-btn-ghost-primary" to="/map">Map</RouterLink>
    </div>
  </div>
</template>
