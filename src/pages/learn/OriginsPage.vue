<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { origins } from '@/content/origins'
import ContentTable from '@/components/ContentTable.vue'

useSeo({
  title: origins.title,
  description: origins.description,
  path: '/read/origins',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>{{ origins.title }}</h1>
      <p>{{ origins.description }}</p>
    </header>
    <article class="prose section" style="padding-top: 0">
      <p v-for="(p, i) in origins.paragraphs" :key="i">{{ p }}</p>
      <h2>Kamiya’s psychological needs</h2>
      <ContentTable :headers="origins.kamiyaNeeds.headers" :rows="origins.kamiyaNeeds.rows" />
      <h2>Ken Mogi’s five pillars</h2>
      <ContentTable :headers="origins.mogiPillars.headers" :rows="origins.mogiPillars.rows" />
      <p>
        <RouterLink to="/map">Open the map</RouterLink>
        ·
        <RouterLink to="/read">All topics</RouterLink>
      </p>
    </article>
  </div>
</template>
