import type * as ApiTypes from './types'
import * as TauriHTTP from '@tauri-apps/api/http'
import { Mutex } from 'async-mutex'
import { Gitification } from '..'

export const mutex = new Mutex()

export function getUser(accessToken: string) {
  const req = Gitification.utils.github.sendGithubApiRequest<ApiTypes.AnyUser>('https://api.github.com/user', {
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
}

export async function getThreads(args: GetThreadsArgs) {
  const { onlyParticipating, all } = args

  return Gitification.utils.github.sendGithubApiRequest<ApiTypes.Thread[]>('https://api.github.com/notifications', {
    method: 'get',
    searchParams: {
      participating: onlyParticipating,
      all,
    },
  })
}

export function markThreadAsRead(id: ApiTypes.Thread['id']) {
  return Gitification.utils.github.sendGithubApiRequest(`https://api.github.com/notifications/threads/${id}`, {
    method: 'patch',
  })
}

export async function unsubscribeThread(id: ApiTypes.Thread['id']) {
  await Gitification.utils.github.sendGithubApiRequest(`https://api.github.com/notifications/threads/${id}/subscription`, {
    method: 'put',
  })

  await markThreadAsRead(id)
}
