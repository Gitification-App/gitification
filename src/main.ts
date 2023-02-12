import './assets/main.scss'
import 'focus-visible'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { isEnabled as isAutostartEnabled } from 'tauri-plugin-autostart-api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import App from './App.vue'
import { AppStorage, cacheStorageFromDisk } from './storage'
import { useStore } from './stores/store'
import { initDevtools } from './utils/initDevtools'
import { useKey } from './composables/useKey'
import { Page } from './constants'
import { getReleases } from './api/releases'
import { getNewRelease } from './utils/getNewRelease'

(async () => {
  dayjs.extend(relativeTime)
  window.addEventListener('contextmenu', e => e.preventDefault())

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  await cacheStorageFromDisk()

  const store = useStore(pinia)
  const token = AppStorage.get('accessToken')
  const user = AppStorage.get('user')

  AppStorage.set('openAtStartup', await isAutostartEnabled())

  if (token && user) {
    store.setPage(Page.Home)
    store.fetchNotifications(true)
  }

  {
    const releases = await getReleases(AppStorage.get('accessToken'))
    store.newRelease = getNewRelease(releases)
  }

  app.mount('#app')
})()

if (import.meta.env.DEV) {
  initDevtools()
  useKey('command+r', () => location.reload(), { prevent: true })
}
