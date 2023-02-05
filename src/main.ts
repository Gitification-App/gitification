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
})()
