/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module '*?raw' {
  const content: string
  export default content
}

declare module '@vanduo-oss/vd3/css'
declare module '@vanduo-oss/vd3-cbun/flowchart/css'
declare module '@vanduo-oss/vd3-cbun/charts/css'
