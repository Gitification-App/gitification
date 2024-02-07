import { GITHUB_AUTHORIZE_ENDPOINT, GITHUB_AUTH_SCOPES } from '../api/constants'
import type { Thread } from '../api/notifications'
import { NotificationSubject } from '../constants'
import { createURL } from './url'

const NOTIFICATION_REFERRER_ID_KEY = 'notification_referrer_id'
const DISCUSSIONS_QUERY_KEY = 'discussions_q'

export function createNotificationReferrerId(
  notificationId: string,
  userId: number,
) {
  return window.btoa(`018:NotificationThread${notificationId}:${userId}`)
}

export type ToGithubWebURLArgs = {
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

export function createAuthURL(port: number) {
  const GITHUB_AUTH_QUERIES = {
    client_id: import.meta.env.VITE_CLIENT_ID,
    scope: GITHUB_AUTH_SCOPES.join(' '),
    redirect_uri: `http://localhost:${port}/callback`,
  }

  return createURL({ url: GITHUB_AUTHORIZE_ENDPOINT, query: GITHUB_AUTH_QUERIES })
}
