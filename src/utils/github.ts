import { GITHUB_AUTHORIZE_ENDPOINT, GITHUB_AUTH_SCOPES } from '../api/constants'
import type { Thread } from '../api/notifications'
import { NotificationReason, NotificationSubject } from '../constants'
import { createURL } from './url'

const NOTIFICATION_REFERRER_ID_KEY = 'notification_referrer_id'
const DISCUSSIONS_QUERY_KEY = 'discussions_q'

export function createNotificationReferrerId(
  notificationId: string,
  userId: number,
) {
  return window.btoa(`018:NotificationThread${notificationId}:${userId}`)
}

export type CreateGithubWebUrlParams = {
  notification: Thread
  userId: number
}

export function createGithubWebURL({ notification, userId }: CreateGithubWebUrlParams) {
  const notificationReferrerId = createNotificationReferrerId(notification.id, userId)

  let url: string

  if (notification.subject.type === NotificationSubject.Discussion) {
    url = `https://github.com/${notification.repository.full_name}/discussions`
    url += `?${DISCUSSIONS_QUERY_KEY}=${decodeURIComponent(notification.subject.title)}`
  }
  else if (notification.reason === NotificationReason.CiActivity) {
    // We cannot produce link to CiActivity so target to repo name
    url = `https://github.com/${notification.repository.full_name}`
  }
  else {
    url = notification.subject.url.replace('api.github.com/repos', 'github.com')

    if (url.includes('/pulls/')) {
      url = url.replace('/pulls/', '/pull/')
    }

    if (url.includes('/releases/')) {
      url = url.replace('/repos', '')
      url = url.slice(0, url.lastIndexOf('/'))
    }
  }

  const refer = `${NOTIFICATION_REFERRER_ID_KEY}=${notificationReferrerId}`

  if (url.includes('?')) {
    return `${url}&${refer}`
  }

  return `${url}?${refer}`
}

export function createAuthURL(port: number) {
  const GITHUB_AUTH_QUERIES = {
    client_id: import.meta.env.VITE_CLIENT_ID,
    scope: GITHUB_AUTH_SCOPES.join(' '),
    redirect_uri: `http://localhost:${port}/callback`,
  }

  return createURL({ url: GITHUB_AUTHORIZE_ENDPOINT, query: GITHUB_AUTH_QUERIES })
}
