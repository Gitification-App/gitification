import { SERVER_PORT } from '../constants'
import { createURL } from '../utils/url'

export const GITHUB_AUTHORIZE_ENDPOINT = 'https://github.com/login/oauth/authorize'
export const GITHUB_AUTH_SCOPES = ['notifications', 'read:user']

export const GITHUB_AUTH_QUERIES = {
  client_id: import.meta.env.VITE_CLIENT_ID,
  scope: GITHUB_AUTH_SCOPES.join(' '),
  redirect_uri: `http://localhost:${SERVER_PORT}/callback`,
}

export const GITHUB_AUTH_URL = createURL({ url: GITHUB_AUTHORIZE_ENDPOINT, query: GITHUB_AUTH_QUERIES })
