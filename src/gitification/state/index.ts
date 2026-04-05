import type { OsType } from '@tauri-apps/api/os'
import type { UpdateManifest } from '@tauri-apps/api/updater'

import type { Option } from '../../types'
import type * as ApiTypes from '../api/types'
import { reactive, shallowReactive, shallowRef } from 'vue'

export function createState() {
  const threads = shallowRef<ApiTypes.Thread[]>([])
  const notificationFetchStatus = shallowRef<'idle' | 'syncing' | 'loading' | 'failed'>('idle')
  const checkedThreadIds = reactive(new Set<string>())
  const newRelease = shallowRef<Option<UpdateManifest>>(null)
  const osType = shallowRef<OsType>('Darwin')

  return shallowReactive({
    threads,
    notificationFetchStatus,
    checkedThreadIds,
    newRelease,
    osType,
  })
}

export type GitificationState = ReturnType<typeof createState>
