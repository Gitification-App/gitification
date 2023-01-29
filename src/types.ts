import type { NotificationTypes } from './constants'

export interface NotificationItem {
  type: NotificationTypes
  repoFullName: string
  title: string
  url: string
  id: string
}
