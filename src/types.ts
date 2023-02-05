import type { NotificationReason } from './constants'

export type Option<T> = T | null

export interface NotificationList {
  repoFullName: string
  children: Array<{
    reason: NotificationReason
    title: string
    url: string
    id: string
  }>
}

export interface AppStorageContext {
  accessToken: Option<string>
  openAtStartup: boolean
  soundsEnabled: boolean
  markAsReadOnClick: boolean
}
