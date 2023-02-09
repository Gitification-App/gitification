import type { Thread } from './api/notifications'
import type { User } from './api/user'

export type Option<T> = T | null

export interface NotificationList {
  repoFullName: string
  threads: Thread[]
}

export interface AppStorageContext {
  user: Option<User>
  accessToken: Option<string>
  showOnlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  markAsReadOnClick: boolean
  showReadNotifications: boolean
}
