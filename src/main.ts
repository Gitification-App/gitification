import './assets/main.scss'
import 'wowerlay/style.css'
import 'focus-visible'
import 'overlayscrollbars/overlayscrollbars.css'

import { createApp } from 'vue'
import { isEnabled as isAutostartEnabled } from '@tauri-apps/plugin-autostart'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { isPermissionGranted } from '@tauri-apps/plugin-notification'
import { type as osType } from '@tauri-apps/plugin-os'
import { check } from '@tauri-apps/plugin-updater'
import App from './App.vue'
import { AppStorage, cacheStorageFromDisk } from './storage'
import { useStore } from './stores/store'
import { useKey } from './composables/useKey'
import 'dayjs/locale/en'
import 'dayjs/locale/tr'
import { Page, useRoute } from './composables/useRoute'
import { useCommonCalls } from './composables/useCommonCalls'

async function main() {
  if (import.meta.env.MODE !== 'production') {
    useKey('command+r', () => location.reload(), { prevent: true })

    const scriptElement = document.createElement('script')
    scriptElement.type = 'text/javascript'
    scriptElement.src = 'http://localhost:8098'
    document.head.appendChild(scriptElement)
  }

  dayjs.extend(relativeTime)
  window.addEventListener('contextmenu', e => e.preventDefault())

  const app = createApp(App)

  await cacheStorageFromDisk()
  const store = useStore()
  const route = useRoute()
  const token = AppStorage.get('accessToken')
  const user = AppStorage.get('user')

  if (token && user) {
    route.go(Page.Home)
    useCommonCalls().fetchThreads()
  }

  const [autoStartEnabled, notificationsGranted] = await Promise.all([isAutostartEnabled(), isPermissionGranted()])

  AppStorage.set('openAtStartup', autoStartEnabled)

  if (!notificationsGranted) {
    AppStorage.set('showSystemNotifications', false)
  }

  try {
    const update = await check()

    if (update) {
      store.newRelease = update
    }
  }
  catch (error) {
    console.error(error)
  }

  const os = await osType()
  if (os === 'macos') {
    document.documentElement.setAttribute('data-os-darwin', '')
  }

  app.mount('#app')
}

main()
