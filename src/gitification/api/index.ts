import type { StorageUser } from '../storage/types'
import type * as ApiTypes from './types'

export type { ApiTypes as Types }

export type CreateApiOptions = {
  nativeFetch: typeof import('@tauri-apps/plugin-http').fetch
}

type GithubApiRequestOptions = {
  method: string
  searchParams?: Record<string, string | number | boolean>
  headers?: HeadersInit
  accessToken: string
  signal?: AbortSignal
}

export function createApi({ nativeFetch }: CreateApiOptions) {
  async function sendRequest<T>(url: string, options: GithubApiRequestOptions) {
    const { method, searchParams, headers: _headers = {}, accessToken, signal } = options
    const requestURL = new URL(url)

    for (const [key, value] of Object.entries(searchParams ?? {})) {
      requestURL.searchParams.set(key, String(value))
    }

    requestURL.searchParams.set('t', Date.now().toString())

    const headers = new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ..._headers,
    })
    headers.set('Authorization', `token ${accessToken}`)

    const response = await nativeFetch(requestURL.toString(), {
      method,
      headers,
      signal,
    })

    return [await response.json() as T, response] as const
  }

  function getUser(accessToken: string) {
    const req = sendRequest<ApiTypes.SimpleUser>('https://api.github.com/user', {
      method: 'get',
      accessToken,
    })

    return req
      .then((res) => res)
      .catch(() => null)
  }

  async function getAccessToken({ clientId, clientSecret, code, redirectUri }: GetAccessTokenArgs) {
    const res = await nativeFetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    if (!res.ok) {
      throw res
    }

    return { ...res, data: await res.json() as ApiTypes.AccessToken }
  }

  function getThreads(args: GetThreadsArgs) {
    const { onlyParticipating, all, accessToken, signal } = args
    const headers = new Headers()

    return sendRequest<ApiTypes.Thread[]>('https://api.github.com/notifications', {
      accessToken,
      method: 'get',
      headers,
      signal,
      searchParams: {
        participating: onlyParticipating,
        all,
        t: Date.now(),
      },
    })
  }

  function markThreadAsRead(id: ApiTypes.Thread['id'], accessToken: string) {
    return sendRequest(`https://api.github.com/notifications/threads/${id}`, {
      method: 'patch',
      accessToken,
    })
  }

  async function unsubscribeThread(id: ApiTypes.Thread['id'], accessToken: string) {
    await sendRequest(`https://api.github.com/notifications/threads/${id}/subscription`, {
      method: 'put',
      accessToken,
    })

    await markThreadAsRead(id, accessToken)
  }

  async function createThreadHtmlURL({ thread, user }: CreateThreadUrlArgs) {
    const notificationReferrerId = btoa(`018:NotificationThread${thread.id}:${user.user.id}`)
    let url: null | string = null

    if (thread.subject.type === 'CheckSuite') {
      url = `https://github.com/${thread.repository.full_name}/actions`
    }
    else if (thread.subject.type === 'RepositoryInvitation') {
      url = `https://github.com/${thread.repository.full_name}/invitations`
    }
    else if (thread.subject.type === 'Discussion') {
      url = (thread.subject.url as string).replace('api.github.com/repos/', 'https://github.com/')
    }
    else if (thread.subject.type === 'Release') {
      url = `https://github.com/${thread.repository.full_name}/releases/`
    }
    else if (thread.subject.type === 'PullRequest') {
      const prId = (thread.subject.url as string).split('?')[0].split('/').at(-1) as string
      url = `https://github.com/${thread.repository.full_name}/pull/${prId}`
    }
    else if (thread.subject.type === 'Issue') {
      const issueId = (thread.subject.url as string).split('?')[0].split('/').at(-1) as string
      url = `https://github.com/${thread.repository.full_name}/issues/${issueId}`
    }
    else if (thread.subject.type === 'Commit') {
      const commitId = (thread.subject.url as string).split('?')[0].split('/').at(-1) as string
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

    const result = new URL(url)
    result.searchParams.set('notification_referrer_id', notificationReferrerId)
    return result.toString()
  }

  return {
    getUser,
    getAccessToken,
    getThreads,
    markThreadAsRead,
    unsubscribeThread,
    createThreadHtmlURL,
  }
}

export type GetAccessTokenArgs = {
  clientId: string
  clientSecret: string
  code: string
  redirectUri: string
}

export type GetThreadsArgs = {
  onlyParticipating: boolean
  all: boolean
  accessToken: string
  signal?: AbortSignal
}

export type CreateThreadUrlArgs = {
  thread: ApiTypes.Thread
  user: StorageUser
}

export type GiApi = ReturnType<typeof createApi>
