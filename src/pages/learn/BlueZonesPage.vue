<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { blueZones } from '@/content/blueZones'

useSeo({
  title: blueZones.title,
  description: blueZones.description,
  path: '/read/blue-zones',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>{{ blueZones.title }}</h1>
      <p>{{ blueZones.description }}</p>
    </header>
    <article class="prose section" style="padding-top: 0">
      <p v-for="(p, i) in blueZones.paragraphs" :key="i">{{ p }}</p>
      <p>
        <RouterLink to="/read">All topics</RouterLink>
      </p>
    </article>
  </div>
</template>
