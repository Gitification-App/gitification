import type { NotificationTypes } from './constants'

export interface NotificationList {
  repoFullName: string
  children: Array<{
    type: NotificationTypes
    title: string
    url: string
    id: string
  }>
}
