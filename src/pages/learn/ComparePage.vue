<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { compare } from '@/content/compare'
import ContentTable from '@/components/ContentTable.vue'

useSeo({
  title: compare.title,
  description: compare.description,
  path: '/read/compare',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>{{ compare.title }}</h1>
      <p>{{ compare.description }}</p>
    </header>
    <article class="prose section" style="padding-top: 0">
      <p v-for="(p, i) in compare.paragraphs" :key="i">{{ p }}</p>
      <h2>Maslow vs ikigai</h2>
      <ContentTable :headers="compare.maslow.headers" :rows="compare.maslow.rows" />
      <p>
        <RouterLink to="/read">All topics</RouterLink>
      </p>
    </article>
  </div>
</template>
