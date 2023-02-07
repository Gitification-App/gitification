import { createApp } from 'vue'
import './assets/main.scss'
import { createPinia } from 'pinia'
import App from './App.vue'
import { AppStorage, cacheStorageFromDisk } from './storage'
import { useStore } from './stores/store'
import { Page } from './constants'
import { initDevtools } from './utils/initDevtools'

window.addEventListener('contextmenu', e => e.preventDefault())

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

;(async () => {
  await cacheStorageFromDisk()

  const store = useStore(pinia)
  const token = AppStorage.get('accessToken')
  const user = AppStorage.get('user')

  if (token && user)
    store.setPage(Page.Home)

  app.mount('#app')
})()

if (import.meta.env.DEV) {
  initDevtools()
  window.addEventListener('keydown', (event) => {
    if ((event.key === 'r' || event.key === 'r') && event.metaKey)
      location.reload()
  })
}
