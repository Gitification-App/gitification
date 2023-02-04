import type { NotificationReason } from './constants'

export interface NotificationList {
  repoFullName: string
  children: Array<{
    reason: NotificationReason
    title: string
    url: string
    id: string
  }>
}
