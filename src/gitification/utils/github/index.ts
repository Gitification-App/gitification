export type CreateCodeCallbackURLOptions = {
  redirectUri: string
}

export function createCodeCallbackURL({ redirectUri }: CreateCodeCallbackURLOptions) {
  const endpoint = 'https://github.com/login/oauth/authorize'
  const scopes = ['notifications', 'read:user']

  const url = new URL(endpoint)

  url.searchParams.set('client_id', import.meta.env.VITE_CLIENT_ID)
  url.searchParams.set('scope', scopes.join(' '))
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('prompt', 'select_account')

  return url.toString()
}
