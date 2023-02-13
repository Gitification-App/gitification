import type { AppStorageContext } from '../types'

export function createBaseGithubApiHeaders(accessToken: AppStorageContext['accessToken']) {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }

  if (accessToken)
    headers.Authorization = `token ${accessToken}`

  return headers
}
