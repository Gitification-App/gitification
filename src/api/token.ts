import { fetch } from '@tauri-apps/plugin-http'

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
  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  })

  if (!res.ok) {
    throw res
  }

  const data = await res.json() as GetAccessTokenResponse

  return { data, ok: res.ok }
}
