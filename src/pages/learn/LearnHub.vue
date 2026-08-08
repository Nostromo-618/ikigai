<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { LEARN_SECTIONS } from '@/content/types'

useSeo({
  title: 'Read',
  description:
    'Short reads on authentic Japanese ikigai, the Western diagram, Blue Zones, science, and stories.',
  path: '/read',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1 v-reveal>Read</h1>
      <p v-reveal="60">
        Philosophy, evidence, and honesty about the four-circle diagram — then take what resonates
        back to your map.
      </p>
    </header>

    <div class="learn-grid section" style="padding-top: 0">
      <RouterLink
        v-for="(section, i) in LEARN_SECTIONS"
        :key="section.slug"
        :to="section.path"
        class="learn-link"
        v-reveal="80 + i * 40"
      >
        <h2>{{ section.title }}</h2>
        <p>{{ section.description }}</p>
      </RouterLink>
    </div>
  </div>
</template>
