import type { OsType } from '@tauri-apps/api/os'
import type { UpdateManifest } from '@tauri-apps/api/updater'
import type { Thread } from '../../api/notifications'
import type { NotificationList, Option } from '../../types'
import { shallowReactive, shallowRef } from 'vue'

export function createState() {
  const notifications = shallowRef<NotificationList>([])

  const notificationFetchStatus = shallowRef<'idle' | 'syncing' | 'loading' | 'failed'>('idle')
  const checkedItems = shallowRef<Thread[]>([])

  const newRelease = shallowRef<Option<UpdateManifest>>(null)

  const osType = shallowRef<OsType>('Darwin')

  return shallowReactive({
    notifications,
    notificationFetchStatus,
    checkedItems,
    newRelease,
    osType,
  })
}

export type GitificationState = ReturnType<typeof createState>
