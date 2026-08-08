<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { science } from '@/content/science'
import ContentTable from '@/components/ContentTable.vue'

useSeo({
  title: science.title,
  description: science.description,
  path: '/read/science',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>{{ science.title }}</h1>
      <p>{{ science.description }}</p>
    </header>
    <article class="prose section" style="padding-top: 0">
      <p v-for="(p, i) in science.paragraphs" :key="i">{{ p }}</p>
      <h2>Ikigai-9 dimensions</h2>
      <ContentTable
        :headers="science.ikigai9Dimensions.headers"
        :rows="science.ikigai9Dimensions.rows"
      />
      <p>
        <RouterLink to="/quiz">Take the Ikigai-9 quiz</RouterLink>
        ·
        <RouterLink to="/read">All topics</RouterLink>
      </p>
    </article>
  </div>
</template>
