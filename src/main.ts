import { isPermissionGranted } from '@tauri-apps/api/notification'
import { type as osType } from '@tauri-apps/api/os'
import { checkUpdate } from '@tauri-apps/api/updater'
import dayjs from 'dayjs'

import relativeTime from 'dayjs/plugin/relativeTime'
import { isEnabled as isAutostartEnabled } from 'tauri-plugin-autostart-api'
import { createApp } from 'vue'
import App from './App.vue'
import { useKey } from './composables/useKey'
import { Gitification } from './gitification'

import './lib.css'
import 'dayjs/locale/en'
import 'dayjs/locale/tr'

async function main() {
  if (import.meta.env.MODE !== 'production') {
    useKey('command+r', () => location.reload(), { prevent: true })
    ;(globalThis as any).Gitification = Gitification
  }

  dayjs.extend(relativeTime)
  window.addEventListener('contextmenu', (e) => e.preventDefault())

  await Gitification.storage.syncFromDisk()

  const token = Gitification.storage.get('accessToken')
  const user = Gitification.storage.get('user')

  // if (token && user) {
  //   Gitification.router.navigate('home', { fetchOnEnter: true })
  // }

  const [
    autoStartEnabled,
    notificationsGranted,
  ] = await Promise.all([isAutostartEnabled(), isPermissionGranted()])

  Gitification.storage.set('openAtStartup', autoStartEnabled)

  if (!notificationsGranted) {
    Gitification.storage.set('showSystemNotifications', false)
  }

  checkUpdate()
    .then(({ shouldUpdate, manifest }) => {
      if (shouldUpdate && manifest != null) {
        Gitification.state.newRelease.value = manifest
      }
    })

  Gitification.state.osType.value = await osType()

  const app = createApp(App)
  app.mount('#app')
}

main()
