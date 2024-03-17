import { Body, ResponseType, fetch } from '@tauri-apps/api/http'

export type GetAccessTokenArgs = {
  clientId: string
  clientSecret: string
  code: string
}

export type GetAccessTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
  scope: string
  token_type: string
}

export async function getAccessToken({ clientId, clientSecret, code }: GetAccessTokenArgs) {
  const body = Body.json({
    client_id: clientId,
    client_secret: clientSecret,
    code,
  })

  const res = await fetch<GetAccessTokenResponse>('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
    },
    body,
    responseType: ResponseType.JSON,
  })

  if (!res.ok) {
    throw res
  }

  return res
}
