<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { facts } from '@/content/facts'

useSeo({
  title: facts.title,
  description: facts.description,
  path: '/read/facts',
})
</script>

<template>
  <div class="container">
    <header class="page-header">
      <h1>{{ facts.title }}</h1>
      <p>{{ facts.description }}</p>
    </header>
    <ul class="fact-list section" style="padding-top: 0">
      <li v-for="(item, i) in facts.items" :key="i" v-reveal="i * 50">{{ item }}</li>
    </ul>
    <p class="container" style="padding-left: 0">
      <RouterLink to="/read">All topics</RouterLink>
    </p>
  </div>
</template>
