import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import { writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { SITE } from './src/data/site.ts'
import { SSG_ROUTES } from './src/router/ssgRoutes.ts'

function generateSeoFiles() {
  const siteUrl = SITE.url.endsWith('/') ? SITE.url.slice(0, -1) : SITE.url
  const sitemapUrls = SSG_ROUTES.filter((r) => !r.includes('*')).map((path) => {
    const loc = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`
    return {
      loc,
      lastmod: '2026-08-08',
      changefreq: path === '/' || path === '/map' ? 'weekly' : 'monthly',
      priority: path === '/' ? '1.0' : path === '/map' ? '0.95' : path === '/read' ? '0.9' : '0.8',
    }
  })

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`

  const rootDir = process.cwd()
  const publicDir = join(rootDir, 'public')
  writeFileSync(join(publicDir, 'sitemap.xml'), sitemapXml, 'utf-8')
  writeFileSync(
    join(publicDir, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
    'utf-8',
  )

  const distDir = join(rootDir, 'dist')
  if (existsSync(distDir)) {
    writeFileSync(join(distDir, 'sitemap.xml'), sitemapXml, 'utf-8')
    writeFileSync(
      join(distDir, 'robots.txt'),
      `User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml\n`,
      'utf-8',
    )
  }
}

export default defineConfig({
  base: '/ikigai/',
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    beastiesOptions: false,
    dirStyle: 'nested',
    includedRoutes: () => SSG_ROUTES,
    onFinished() {
      generateSeoFiles()
    },
  },
})
