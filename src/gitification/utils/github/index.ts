import type { Options as KyOptions } from 'ky'
import ky from 'ky'
import { Gitification } from '../..'
import { NotificationReason, NotificationSubject } from '../../../constants'

const api = ky.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
        const token = Gitification.storage.get('accessToken')

        if (token) {
          request.headers.set('Authorization', `token ${token}`)
        }

        const url = new URL(request.url)
        url.searchParams.set('t', Date.now().toString())

        return new Request(url, request)
      },
    ],
  },
})

export type GithubApiRequestOptions = {
  method: NonNullable<KyOptions['method']>
  searchParams?: NonNullable<KyOptions['searchParams']>
  headers?: NonNullable<KyOptions['headers']>
}

export function sendGithubApiRequest<T>(url: string, options: GithubApiRequestOptions) {
  const { method, searchParams, headers } = options

  return api(url, {
    method,
    searchParams,
    headers,
  }).json<T>()
}

const NOTIFICATION_REFERRER_ID_KEY = 'notification_referrer_id'
const DISCUSSIONS_QUERY_KEY = 'discussions_q'

export function createThreadReferrerId(
  notificationId: string,
  userId: number,
) {
  return window.btoa(`018:NotificationThread${notificationId}:${userId}`)
}

export type CreateThreadUrlArgs = {
  thread: Gitification.Types.Api.Thread
  userId: number
}

export function createThreadURL({ thread, userId }: CreateThreadUrlArgs) {
  const notificationReferrerId = createThreadReferrerId(thread.id, userId)

  let url: string

  if (thread.subject.type === NotificationSubject.Discussion) {
    url = `https://github.com/${thread.repository.full_name}/discussions`
    url += `?${DISCUSSIONS_QUERY_KEY}=${decodeURIComponent(thread.subject.title)}`
  }
  else if (thread.reason === NotificationReason.CiActivity) {
    // We cannot produce link to CiActivity so target to repo name
    url = `https://github.com/${thread.repository.full_name}`
  }
  else {
    url = thread.subject.url.replace('api.github.com/repos', 'github.com')

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

export function createCodeCallbackURL(port: number) {
  const endpoint = 'https://github.com/login/oauth/authorize'
  const scopes = ['notifications', 'read:user']

  const url = new URL(endpoint)

  url.searchParams.set('client_id', import.meta.env.VITE_CLIENT_ID)
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('redirect_uri', `http://localhost:${port}/callback`)

  return url.toString()
}
