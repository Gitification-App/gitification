import type { GiActions } from '../actions'
import type { GiApi } from '../api'
import type { GiRouter } from '../router'
import type { GiState } from '../state'
import type { GiTauriLayer } from '../tauri'
import * as utils from '../utils'

const REDIRECT_URI = 'gitification://oauth/callback'

export type CreateAuthOptions = {
  api: GiApi
  actions: Pick<GiActions, 'showWindow' | 'openURL'>
  router: GiRouter
  state: GiState
  tauri: GiTauriLayer
}

export function createAuth(deps: CreateAuthOptions) {
  let processing = false

  async function handleUrl(rawUrl: string) {
    let url: URL

    try {
      url = new URL(rawUrl)
    }
    catch {
      return
    }

    if (url.protocol !== 'gitification:' || url.hostname !== 'oauth' || url.pathname !== '/callback') {
      return
    }

    const error = url.searchParams.get('error')
    const code = url.searchParams.get('code')

    if (error != null) {
      console.error(`GitHub OAuth failed: ${error}`)
      return
    }

    if (code == null) {
      console.error('Ignored GitHub OAuth callback without a code')
      return
    }

    if (processing) {
      return
    }

    processing = true

    try {
      const { data: { access_token: accessToken } } = await deps.api.getAccessToken({
        clientId: import.meta.env.VITE_CLIENT_ID,
        clientSecret: import.meta.env.VITE_CLIENT_SECRET,
        code,
        redirectUri: REDIRECT_URI,
      })

      const result = await deps.api.getUser(accessToken)

      if (result == null) {
        throw new Error('Failed to fetch user data')
      }

      const [user] = result

      if (user == null) {
        throw new Error('GitHub did not return a user')
      }

      const account = { user, accessToken }
      const existingIndex = deps.state.users
        .findIndex(({ user: existingUser }) => existingUser.id === user.id)

      if (existingIndex === -1) {
        deps.state.users.push(account)
      }
      else {
        deps.state.users[existingIndex] = account
      }

      deps.state.currentUser = account
      deps.router.navigate('home')
      await deps.actions.showWindow()
    }
    catch (error) {
      console.error('GitHub OAuth callback failed', error)
    }
    finally {
      processing = false
    }
  }

  function getRedirectUri() {
    return REDIRECT_URI
  }

  function openAuthorization() {
    deps.actions.openURL(
      utils.github.createCodeCallbackURL({ redirectUri: REDIRECT_URI }),
    )
  }

  async function initialize() {
    return deps.tauri.onOpenUrl((urls) => {
      void (async () => {
        if (urls == null) {
          return
        }

        for (const url of urls) {
          await handleUrl(url)
        }
      })()
    })
  }

  return {
    getRedirectUri,
    openAuthorization,
    initialize,
  }
}

export type Auth = ReturnType<typeof createAuth>
