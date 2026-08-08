<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { western } from '@/content/western'
import ContentTable from '@/components/ContentTable.vue'

useSeo({
  title: western.title,
  description: western.description,
  path: '/read/western-diagram',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>{{ western.title }}</h1>
      <p>{{ western.description }}</p>
    </header>
    <article class="prose section" style="padding-top: 0">
      <aside class="disclaimer" role="note">
        <p>{{ western.honesty }}</p>
      </aside>
      <p v-for="(p, i) in western.paragraphs" :key="i">{{ p }}</p>
      <h2>Intersections</h2>
      <ContentTable
        :headers="western.intersections.headers"
        :rows="western.intersections.rows"
      />
      <p>
        <RouterLink to="/map">Practice on the map</RouterLink>
        ·
        <RouterLink to="/read">All topics</RouterLink>
      </p>
    </article>
  </div>
</template>
