import { isPermissionGranted } from '@tauri-apps/api/notification'

import { type as osType } from '@tauri-apps/api/os'
import { checkUpdate } from '@tauri-apps/api/updater'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { createApp } from 'vue'

import App from './App.vue'
import { useKey } from './composables/useKey'
import * as Gitification from './gitification/index'
import 'wowerlay/style.css'
import './lib.css'
import 'dayjs/locale/en'

async function main() {
  if (import.meta.env.MODE !== 'production') {
    useKey('command+r', () => location.reload(), { prevent: true })
    ;(globalThis as any).Gitification = Gitification
  }

  dayjs.extend(relativeTime)
  window.addEventListener('contextmenu', (e) => e.preventDefault())

  await Gitification.storage.syncFromDisk()

  if (Gitification.state.currentUser) {
    Gitification.router.navigate('home')
  }

  checkUpdate()
    .then(({ shouldUpdate, manifest }) => {
      if (shouldUpdate && manifest != null) {
        Gitification.state.newRelease = manifest
      }
    })

  Gitification.state.osType = await osType()
  await Gitification.server.start()

  Gitification.state.settings.openAtStartup = await Gitification.actions.AutoStart.isEnabled()
    .catch(() => false)

  if (Gitification.state.settings.showSystemNotifications) {
    Gitification.state.settings.showSystemNotifications = await isPermissionGranted()
      .catch(() => false)
  }

  const app = createApp(App)
  app.mount('#app')
}

main()
