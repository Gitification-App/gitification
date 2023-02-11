import type { Raw, Ref } from 'vue'
import type { Thread } from './api/notifications'
import type { User } from './api/user'

export type Option<T> = T | null
export type MaybeRef<T> = T | Ref<T>

export interface NotificationListData {
  repoFullName: string
  repoAvatarURL: string
  items: NotificationListDataItem[]
}

export interface NotificationListDataItem {
  id: Thread['id']
  unread: Thread['unread']
  title: Thread['subject']['title']
  reason: Thread['reason']
  type: Thread['subject']['type']
  raw: Raw<Thread>
}

export interface AppStorageContext {
  user: Option<User>
  accessToken: Option<string>
  showOnlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  showReadNotifications: boolean
}

export interface PageState {
  fetchOnEnter?: boolean
}
