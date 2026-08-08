<script setup lang="ts">
import { NAV, SITE } from '@/data/site'

const year = new Date().getFullYear()
</script>

<template>
  <footer class="ik-footer">
    <div class="container footer-inner">
      <div>
        <RouterLink to="/" class="footer-brand">
          <i class="ph-fill ph-circles-three" aria-hidden="true"></i>
          <span>{{ SITE.name }}</span>
        </RouterLink>
        <p class="footer-tag">{{ SITE.tagline }}</p>
      </div>

      <nav class="footer-links" aria-label="Footer">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-for="item in NAV" :key="item.to" :to="item.to">{{ item.label }}</RouterLink>
      </nav>
    </div>

    <div class="container footer-bottom">
      <p class="footer-copy">© {{ year }} {{ SITE.name }} · Purpose maps stay in your browser</p>
      <p class="footer-credits">
        <a href="https://github.com/vanduo-oss/vd3" target="_blank" rel="noopener noreferrer"
          >UI powered by vd3</a
        >
        <a href="https://github.com/vanduo-oss/vd3-cbun" target="_blank" rel="noopener noreferrer"
          >Ikigai Map powered by vd3-cbun</a
        >
      </p>
    </div>
  </footer>
</template>
