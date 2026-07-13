import type * as ApiTypes from './types'
import { fetch as tFetch } from '@tauri-apps/plugin-http'
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
  redirectUri: string
}

export async function getAccessToken({ clientId, clientSecret, code, redirectUri }: GetAccessTokenArgs) {
  const res = await tFetch('https://github.com/login/oauth/access_token', {
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

export type GetThreadsArgs = {
  onlyParticipating: boolean
  all: boolean
  accessToken: string
  ifModifiedSince?: string
}

export function getThreads(args: GetThreadsArgs) {
  const { onlyParticipating, all, accessToken } = args

  const headers = new Headers()

  return Gitification.utils.github.sendRequest<ApiTypes.Thread[]>('https://api.github.com/notifications', {
    accessToken,
    method: 'get',
    headers,
    searchParams: {
      participating: onlyParticipating,
      all,
      t: Date.now(),
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
