/// <reference types="vite/client" />
/// <reference types="unplugin-icons/types/vue" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

type ImportMetaEnv = {
  readonly VITE_CLIENT_SECRET: string
  readonly VITE_CLIENT_ID: string
}

type ImportMeta = {
  readonly env: ImportMetaEnv
}

declare let __APP_VERSION__: string
