import type { OsType } from '@tauri-apps/plugin-os'
import type { Update } from '@tauri-apps/plugin-updater'

import type { Option } from '../../types'
import type { Types as ApiTypes } from '../api'
import type { GitificationStorage } from '../storage'
import { useMediaQuery } from '@vueuse/core'
import { computed, reactive, ref, shallowRef } from 'vue'

export type GiState = ReturnType<typeof createState>

export type CreateStateOptions = {
  storage: GitificationStorage
}

export function createState({ storage }: CreateStateOptions) {
  const threads = ref([] as ApiTypes.Thread[])
  const threadLookup = computed(() => {
    const lookup: Record<string, ApiTypes.Thread> = {}
    for (const thread of threads.value) {
      lookup[thread.id] = thread
    }
    return lookup
  })
  const threadLoadStatus = ref('idle' as 'idle' | 'syncing' | 'loading' | 'failed')
  const checkedThreadIds = reactive(new Set<string>())
  const checkedThreads = computed(() => threads.value
    .filter((thread) => checkedThreadIds.has(thread.id)))
  // Tauri's Update instance uses private fields and must not be proxied by Vue.
  const newRelease = shallowRef(null as Option<Update>)

  const osType = ref('Darwin' as OsType)

  const users = computed({
    get: () => storage.value.users,
    set: (value) => storage.value.users = value,
  })

  const settings = computed({
    get: () => storage.value.settings,
    set: (value) => void (storage.value.settings = value),
  })

  const currentUser = computed({
    get() {
      return users.value
        .find((value) => value.user.id === storage.value.activeUserId)
        ?? null
    },
    set(user) {
      storage.value.activeUserId = user?.user.id ?? null
    },
  })

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = computed({
    get() {
      let preference = storage.value.settings.colorPreference

      if (preference === 'system') {
        preference = prefersDark.value ? 'dark' : 'light'
      }

      return preference
    },
    set(value: 'light' | 'dark' | 'system') {
      storage.value.settings.colorPreference = value
    },
  })

  const state = {
    threads,
    threadLoadStatus,
    checkedThreadIds,
    newRelease,
    threadLookup,
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
