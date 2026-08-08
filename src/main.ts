import { ViteSSG } from 'vite-ssg'
import { VanduoVue } from '@vanduo-oss/vd3'
import '@fontsource/elms-sans/400.css'
import '@fontsource/elms-sans/500.css'
import '@fontsource/elms-sans/600.css'
import '@fontsource/elms-sans/700.css'
import '@fontsource/elms-sans/800.css'
import '@vanduo-oss/vd3/css'
import '@vanduo-oss/vd3-cbun/flowchart/css'
import './styles/site.css'
import './styles/ikigai-map.css'
import App from './App.vue'
import { routes } from './router/routes'
import { reveal } from './composables/reveal'
import { SITE } from './data/site'
import { hasDeclinedDisclaimer } from './lib/disclaimer'

export const createApp = ViteSSG(
  App,
  {
    routes,
    base: import.meta.env.BASE_URL,
    scrollBehavior(to, _from, savedPosition) {
      if (savedPosition) return savedPosition
      if (to.hash) return { el: to.hash, top: 80, behavior: 'smooth' }
      return { top: 0 }
    },
  },
  ({ app, router }) => {
    app.use(VanduoVue, {
      themeDefaults: {
        PRIMARY_LIGHT: SITE.theme.PRIMARY_LIGHT,
        PRIMARY_DARK: SITE.theme.PRIMARY_DARK,
        NEUTRAL: SITE.theme.NEUTRAL,
        RADIUS: SITE.theme.RADIUS,
        FONT: SITE.theme.FONT,
      },
    })
    app.directive('reveal', reveal)

    router.beforeEach((to) => {
      if (typeof sessionStorage === 'undefined') return true
      if (hasDeclinedDisclaimer() && to.name !== 'farewell') {
        return { name: 'farewell' }
      }
      return true
    })
  },
)
