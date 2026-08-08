import { useHead } from '@unhead/vue'
import { SITE } from '@/data/site'

export interface SeoInput {
  title?: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  robots?: string
  jsonLd?: Record<string, unknown>[]
}

/**
 * Absolute public URL for SEO (canonical, og:image, etc.).
 * SITE.url already includes the Pages project path (`/ikigai`); path args are app routes
 * or root-relative asset paths (e.g. `/og-default.svg`), not Vite BASE_URL prefixes.
 */
export const abs = (pathOrUrl: string): string => {
  if (!pathOrUrl) return SITE.url
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) return pathOrUrl

  const siteUrlClean = SITE.url.endsWith('/') ? SITE.url.slice(0, -1) : SITE.url
  const base = import.meta.env.BASE_URL || '/'

  let cleanPath = pathOrUrl
  if (base !== '/' && cleanPath.startsWith(base)) {
    cleanPath = cleanPath.slice(base.length)
  }
  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`
  }

  return `${siteUrlClean}${cleanPath}`
}

export function useSeo(input: SeoInput = {}) {
  const fullTitle = input.title ? `${input.title} | ${SITE.name}` : SITE.name
  const description = input.description ?? SITE.description
  const canonical = abs(input.path ?? '/')
  const image = abs(input.image ?? SITE.defaultImage)
  const type = input.type ?? 'website'
  const robots = input.robots ?? 'index, follow'

  const webPageLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: fullTitle,
    description,
    url: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
    },
  }

  const scripts = [webPageLd, ...(input.jsonLd ?? [])].map((obj) => ({
    type: 'application/ld+json' as const,
    innerHTML: JSON.stringify(obj),
  }))

  useHead({
    title: fullTitle,
    link: [{ rel: 'canonical', href: canonical }],
    meta: [
      { name: 'description', content: description },
      { name: 'author', content: SITE.author },
      { name: 'robots', content: robots },
      { name: 'theme-color', content: SITE.brandColor },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE.name },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: image },
      { property: 'og:locale', content: SITE.locale },
      { name: 'twitter:card', content: SITE.twitter },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:url', content: canonical },
      { name: 'twitter:image', content: image },
    ],
    script: scripts,
  })
}
