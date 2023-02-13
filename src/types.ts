import type { Ref } from 'vue'
import type { MinimalRepository, Thread } from './api/notifications'
import type { User } from './api/user'

export type Option<T> = T | null
export type MaybeRef<T> = T | Ref<T>

export type NotificationList = (Thread | MinimalRepository)[]

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
