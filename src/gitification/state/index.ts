import type { OsType } from '@tauri-apps/api/os'
import type { UpdateManifest } from '@tauri-apps/api/updater'

import type { Option } from '../../types'
import { useMediaQuery } from '@vueuse/core'
import { computed, reactive, ref } from 'vue'
import * as Gitification from '../index'

export type GitificationState = ReturnType<typeof createState>

export function createState() {
  const threads = ref([] as Gitification.api.Types.Thread[])
  const threadLoadStatus = ref('idle' as 'idle' | 'syncing' | 'loading' | 'failed')
  const checkedThreadIds = reactive(new Set<string>())
  const checkedThreads = computed(() => threads.value
    .filter((thread) => checkedThreadIds.has(thread.id)))
  const newRelease = ref(null as Option<UpdateManifest>)

  const osType = ref('Darwin' as OsType)

  const users = computed({
    get: () => Gitification.storage.value.users,
    set: (value) => {
      Gitification.storage.value.users = value
    },
  })

  const settings = computed({
    get: () => Gitification.storage.value.settings,
    set: (value) => void (Gitification.storage.value.settings = value),
  })

  const currentUser = computed({
    get() {
      return users.value
        .find((value) => value.user.id === Gitification.storage.value.activeUserId)
        ?? null
    },
    set(user) {
      Gitification.storage.value.activeUserId = user?.user.id ?? null
    },
  })

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = computed({
    get() {
      let preference = Gitification.storage.value.settings.colorPreference

      if (preference === 'system') {
        preference = prefersDark.value ? 'dark' : 'light'
      }

      return preference
    },
    set(value: 'light' | 'dark' | 'system') {
      Gitification.storage.value.settings.colorPreference = value
    },
  })

  const lastModified = ref<Option<string>>(null)

  const state = {
    lastModified,
    threads,
    threadLoadStatus,
    checkedThreadIds,
    newRelease,
    osType,
    users,
    settings,
    currentUser,
    checkedThreads,
    theme,
  }

  return reactive({
    ...state,
    asRefs: () => state,
  })
}
