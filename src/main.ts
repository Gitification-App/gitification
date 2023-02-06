import { createApp } from 'vue'
import './assets/main.scss'
import { createPinia } from 'pinia'
import App from './App.vue'
import { AppStorage, cacheStorageFromDisk } from './storage'
import { useStore } from './stores/store'
import { Page } from './constants'

window.addEventListener('contextmenu', e => e.preventDefault())

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

;(async () => {
  await cacheStorageFromDisk()

  const store = useStore(pinia)
  const token = AppStorage.get('accessToken')

  if (token)
    store.currentPage = Page.Home

  app.mount('#app')

  if (import.meta.env.DEV) {
    const { connect } = await import('@vue/devtools')
    connect('http://localhost', 8098)

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'http://localhost:8098'
    document.getElementsByTagName('head')[0].appendChild(script)
  }
})()
