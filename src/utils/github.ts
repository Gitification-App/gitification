import type { Thread } from '../api/notifications'
import { NotificationSubject } from '../constants'

const NOTIFICATION_REFERRER_ID_KEY = 'notification_referrer_id'
const DISCUSSIONS_QUERY_KEY = 'discussions_q'

export function createNotificationReferrerId(
  notificationId: string,
  userId: number,
) {
  return window.btoa(`018:NotificationThread${notificationId}:${userId}`)
}

export interface ToGithubWebURLArgs {
  notification: Thread
  userId: number
}

export function toGithubWebURL({ notification, userId }: ToGithubWebURLArgs) {
  const notificationReferrerId = createNotificationReferrerId(notification.id, userId)

  if (notification.subject.type === NotificationSubject.Discussion) {
    let newURL = `https://github.com/${notification.repository.full_name}/discussions`

    newURL = `?${newURL}&${DISCUSSIONS_QUERY_KEY}=${decodeURIComponent(notification.subject.title)}`

    return newURL
  }

  let newUrl = notification.subject.url.replace('api.github.com/repos', 'github.com')

  if (newUrl.includes('/pulls/'))
    newUrl = newUrl.replace('/pulls/', '/pull/')

  if (newUrl.includes('/releases/')) {
    newUrl = newUrl.replace('/repos', '')
    newUrl = newUrl.slice(0, newUrl.lastIndexOf('/'))
  }

  return `${newUrl}?${NOTIFICATION_REFERRER_ID_KEY}=${notificationReferrerId}`
}
