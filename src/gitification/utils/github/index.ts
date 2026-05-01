import type { Options as KyOptions } from 'ky'
import type * as Gitification from '../../index'
import ky from 'ky'

const api = ky.create({
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  hooks: {
    beforeRequest: [
      (request) => {
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
  headers?: HeadersInit
  accessToken: string
}

export async function sendRequest<T>(url: string, options: GithubApiRequestOptions) {
  const { method, searchParams, headers: _headers = {}, accessToken } = options

  const headers = new Headers(_headers)

  headers.set('Authorization', `token ${accessToken}`)

  const response = await api(url, {
    method,
    searchParams,
    headers,
  })

  return [await response.json() as T, response] as const
}

export function createThreadReferrerId(
  notificationId: string,
  userId: number,
) {
  return window.btoa(`018:NotificationThread${notificationId}:${userId}`)
}

export type CreateThreadUrlArgs = {
  thread: Gitification.api.Types.Thread
  user: Gitification.StorageTypes.StorageUser
}

export async function createThreadHtmlURL({ thread, user }: CreateThreadUrlArgs) {
  const notificationReferrerId = createThreadReferrerId(thread.id, user.user.id)

  let url: null | string = null

  if (thread.subject.type === 'CheckSuite') {
    url = `https://github.com/${thread.repository.full_name}/actions`
  }
  else if (thread.subject.type === 'RepositoryInvitation') {
    url = `https://github.com/${thread.repository.full_name}/invitations`
  }
  else if (thread.subject.type === 'Discussion') {
    url = (thread.subject.url as string).replace('api.github.com/repos/', `https://github.com/`)
  }
  else if (thread.subject.type === 'Release') {
    url = `https://github.com/${thread.repository.full_name}/releases/`
  }
  else if (thread.subject.type === 'PullRequest') {
    const prId = (thread.subject.url as string)
      .split('?')[0]
      .split('/')
      .at(-1) as string

    url = `https://github.com/${thread.repository.full_name}/pull/${prId}`
  }
  else if (thread.subject.type === 'Issue') {
    const issueId = (thread.subject.url as string)
      .split('?')[0]
      .split('/')
      .at(-1) as string

    url = `https://github.com/${thread.repository.full_name}/issues/${issueId}`
  }
  else if (thread.subject.type === 'Commit') {
    const commitId = (thread.subject.url as string)
      .split('?')[0]
      .split('/')
      .at(-1) as string

    url = `https://github.com/${thread.repository.full_name}/commit/${commitId}`
  }
  else if (thread.subject.url != null) {
    try {
      const [data] = await sendRequest<{ html_url?: string }>(thread.subject.url, {
        method: 'GET',
        accessToken: user.accessToken,
      })

      url = data?.html_url ?? null
    }
    catch {
      url = null
    }
  }

  if (url == null) {
    return null
  }

  const uri = new URL(url)
  uri.searchParams.set('notification_referrer_id', notificationReferrerId)

  return uri.toString()
}

export function createCodeCallbackURL(port: number) {
  const endpoint = 'https://github.com/login/oauth/authorize'
  const scopes = ['notifications', 'read:user']

  const url = new URL(endpoint)

  url.searchParams.set('client_id', import.meta.env.VITE_CLIENT_ID)
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('redirect_uri', `http://localhost:${port}/callback`)
  url.searchParams.set('prompt', 'select_account')

  return url.toString()
}
