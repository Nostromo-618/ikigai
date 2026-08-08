import type { RouteRecordRaw } from 'vue-router'
import { SSG_ROUTES } from './ssgRoutes'

export { SSG_ROUTES }

export const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/pages/HomePage.vue') },
  { path: '/map', name: 'map', component: () => import('@/pages/MapPage.vue') },
  { path: '/read', name: 'read', component: () => import('@/pages/learn/LearnHub.vue') },
  {
    path: '/read/origins',
    name: 'read-origins',
    component: () => import('@/pages/learn/OriginsPage.vue'),
  },
  {
    path: '/read/western-diagram',
    name: 'read-western',
    component: () => import('@/pages/learn/WesternPage.vue'),
  },
  {
    path: '/read/blue-zones',
    name: 'read-blue-zones',
    component: () => import('@/pages/learn/BlueZonesPage.vue'),
  },
  {
    path: '/read/science',
    name: 'read-science',
    component: () => import('@/pages/learn/SciencePage.vue'),
  },
  {
    path: '/read/compare',
    name: 'read-compare',
    component: () => import('@/pages/learn/ComparePage.vue'),
  },
  {
    path: '/read/stories',
    name: 'read-stories',
    component: () => import('@/pages/learn/StoriesPage.vue'),
  },
  {
    path: '/read/facts',
    name: 'read-facts',
    component: () => import('@/pages/learn/FactsPage.vue'),
  },
  { path: '/learn', redirect: '/read' },
  { path: '/learn/:pathMatch(.*)*', redirect: (to) => `/read/${to.params.pathMatch}` },
  { path: '/quiz', name: 'quiz', component: () => import('@/pages/QuizPage.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/pages/NotFound.vue') },
]
