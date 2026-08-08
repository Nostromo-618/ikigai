<script setup lang="ts">
import { useSeo } from '@/composables/useSeo'
import { SITE } from '@/data/site'

useSeo({
  title: undefined,
  description: SITE.description,
  path: '/',
  jsonLd: [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
      description: SITE.description,
      inLanguage: 'en',
    },
  ],
})
</script>

<template>
  <section class="page-hero">
    <div class="container page-hero-inner">
      <h1 class="brand-hero" v-reveal>
        <i class="ph-fill ph-circles-three brand-hero-mark" aria-hidden="true"></i>
        <span class="brand-hero-text">Ikigai</span>
        <span class="brand-hero-sep" aria-hidden="true">|</span>
        <span class="brand-hero-ja" lang="ja">生き甲斐</span>
      </h1>
      <p class="hero-lead" v-reveal="80">
        {{ SITE.tagline }}
      </p>
      <div class="hero-actions" v-reveal="160">
        <RouterLink class="vd-btn vd-btn-primary vd-btn-lg" to="/map">Open your map</RouterLink>
        <RouterLink class="vd-btn vd-btn-ghost-primary vd-btn-lg" to="/read">Read the philosophy</RouterLink>
      </div>
    </div>
  </section>
</template>
