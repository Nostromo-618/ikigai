<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { stories } from '@/content/stories'

useSeo({
  title: stories.title,
  description: stories.description,
  path: '/read/stories',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>{{ stories.title }}</h1>
      <p>{{ stories.description }}</p>
    </header>
    <article class="prose section" style="padding-top: 0">
      <section v-for="person in stories.people" :key="person.name">
        <h2>{{ person.name }}</h2>
        <h3>{{ person.subtitle }}</h3>
        <p v-for="(p, i) in person.body" :key="i">{{ p }}</p>
        <blockquote>{{ person.quote }}</blockquote>
      </section>
      <p>
        <RouterLink to="/read">All topics</RouterLink>
      </p>
    </article>
  </div>
</template>
