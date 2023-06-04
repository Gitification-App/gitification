import './assets/main.scss'
import 'wowerlay/style.css'
import 'focus-visible'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { isEnabled as isAutostartEnabled } from 'tauri-plugin-autostart-api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { isPermissionGranted } from '@tauri-apps/api/notification'
import App from './App.vue'
import { AppStorage, cacheStorageFromDisk } from './storage'
import { useStore } from './stores/store'
import { Page } from './constants'
import { getReleases } from './api/releases'
import { getNewRelease } from './utils/getNewRelease'
import { initDevtools } from './utils/initDevtools'
import { useKey } from './composables/useKey'

async function main() {
  if (import.meta.env.DEV) {
    initDevtools()
    useKey('command+r', () => location.reload(), { prevent: true })
  }

  dayjs.extend(relativeTime)
  window.addEventListener('contextmenu', e => e.preventDefault())

  const app = createApp(App)
  const pinia = createPinia()

  app.use(pinia)

  await cacheStorageFromDisk()

  const store = useStore(pinia)
  const token = AppStorage.get('accessToken')
  const user = AppStorage.get('user')

  const [autoStartEnabled, notificationsGranted] = await Promise.all([isAutostartEnabled(), isPermissionGranted()])

  AppStorage.set('openAtStartup', autoStartEnabled)

  if (!notificationsGranted)
    AppStorage.set('showSystemNotifications', false)

  if (token && user) {
    store.setPage(Page.Home)
    store.fetchNotifications(true)
  }

  {
    const releases = await getReleases(AppStorage.get('accessToken'))
    store.newRelease = getNewRelease(releases)
  }

  app.mount('#app')
}

main()
