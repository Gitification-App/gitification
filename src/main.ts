import { isPermissionGranted } from '@tauri-apps/api/notification'
import { type as osType } from '@tauri-apps/api/os'
import { checkUpdate } from '@tauri-apps/api/updater'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { uniqBy } from 'es-toolkit'
import { isEnabled as isAutostartEnabled } from 'tauri-plugin-autostart-api'
import { createApp } from 'vue'
import App from './App.vue'
import { useKey } from './composables/useKey'

import * as Gitification from './gitification'
import 'wowerlay/style.css'
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

  if (token && user) {
    Gitification.storage.set('allUsers', (allUsers) => (
      uniqBy([...allUsers, user], (u) => u.id)
    ))

    Gitification.router.navigate('home', { fetchOnEnter: true })
  }

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
  await Gitification.server.start()

  const app = createApp(App)
  app.mount('#app')
}

main()
