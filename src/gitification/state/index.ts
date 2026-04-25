import type { OsType } from '@tauri-apps/api/os'
import type { UpdateManifest } from '@tauri-apps/api/updater'

import type { Option } from '../../types'
import type * as Gitification from '../index'
import { reactive, shallowReactive, shallowRef } from 'vue'

export function createState() {
  const threads = shallowRef<Gitification.api.Types.Thread[]>([])
  const threadLoadStatus = shallowRef<'idle' | 'syncing' | 'loading'>('idle')
  const checkedThreadIds = reactive(new Set<string>())
  const newRelease = shallowRef<Option<UpdateManifest>>(null)
  const osType = shallowRef<OsType>('Darwin')
  const currentUser = shallowRef<Option<Gitification.api.Types.SimpleUser>>(null)

  return shallowReactive({
    threads,
    threadLoadStatus,
    checkedThreadIds,
    newRelease,
    osType,
    currentUser,
  })
}

export type GitificationState = ReturnType<typeof createState>
