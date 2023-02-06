import type { NotificationReason, NotificationSubject } from './constants'

export type Option<T> = T | null

export interface NotificationListChild {
  reason: NotificationReason
  title: string
  url: string
  id: string
  subject: NotificationSubject
}

export interface NotificationList {
  repoFullName: string
  children: NotificationListChild[]
}

export interface AppStorageContext {
  accessToken: Option<string>
  showOnlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  markAsReadOnClick: boolean
}
