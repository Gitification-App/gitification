import type * as ApiTypes from './types'
import * as TauriHTTP from '@tauri-apps/api/http'
import { Mutex } from 'async-mutex'
import * as Gitification from '../index'

export type { ApiTypes as Types }

export const mutex = new Mutex()

export function getUser(accessToken: string) {
  const req = Gitification.utils.github.sendRequest<ApiTypes.SimpleUser>('https://api.github.com/user', {
    method: 'get',
    accessToken,
  })

  return req
    .then((res) => res)
    .catch(() => null)
}

export type GetAccessTokenArgs = {
  clientId: string
  clientSecret: string
  code: string
}

export async function getAccessToken({ clientId, clientSecret, code }: GetAccessTokenArgs) {
  const body = TauriHTTP.Body.json({
    client_id: clientId,
    client_secret: clientSecret,
    code,
  })

  const res = await TauriHTTP.fetch<ApiTypes.AccessToken>('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body,
    responseType: TauriHTTP.ResponseType.JSON,
  })

  if (!res.ok) {
    throw res
  }

  return res
}

export type GetThreadsArgs = {
  onlyParticipating: boolean
  all: boolean
  accessToken: string
}

export async function getThreads(args: GetThreadsArgs) {
  const { onlyParticipating, all, accessToken } = args

  return Gitification.utils.github.sendRequest<ApiTypes.Thread[]>('https://api.github.com/notifications', {
    accessToken,
    method: 'get',
    searchParams: {
      participating: onlyParticipating,
      all,
    },
  })
}

export function markThreadAsRead(id: ApiTypes.Thread['id'], accessToken: string) {
  return Gitification.utils.github.sendRequest(`https://api.github.com/notifications/threads/${id}`, {
    method: 'patch',
    accessToken,
  })
}

export async function unsubscribeThread(id: ApiTypes.Thread['id'], accessToken: string) {
  await Gitification.utils.github.sendRequest(`https://api.github.com/notifications/threads/${id}/subscription`, {
    method: 'put',
    accessToken,
  })

  await markThreadAsRead(id, accessToken)
}

export async function getThreadHTMLURL(thread: ApiTypes.Thread, accessToken: string) {
  if (thread.subject.url == null) {
    // CheckSuite
    return `https://github.com/${thread.repository.full_name}/actions`
  }

  const response = await Gitification.utils.github.sendRequest<{ html_url: string }>(thread.subject.url, {
    method: 'get',
    accessToken,
  })

  return response.html_url
}
