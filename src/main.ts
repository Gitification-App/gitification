import './assets/main.scss'
import 'wowerlay/style.css'
import 'focus-visible'
import 'overlayscrollbars/overlayscrollbars.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { isEnabled as isAutostartEnabled } from 'tauri-plugin-autostart-api'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { isPermissionGranted } from '@tauri-apps/api/notification'
import { type as osType } from '@tauri-apps/api/os'
import { checkUpdate } from '@tauri-apps/api/updater'
import App from './App.vue'
import { AppStorage, cacheStorageFromDisk } from './storage'
import { useStore } from './stores/store'
import { Page } from './constants'
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

  try {
    const { shouldUpdate, manifest } = await checkUpdate()

    if (shouldUpdate)
      store.newRelease = manifest!
  }
  catch (error) {
    console.error(error)
  }

  const os = await osType()
  if (os === 'Darwin')
    document.documentElement.setAttribute('data-os-darwin', '')

  app.mount('#app')
}

main()
