import { getCurrent, onOpenUrl } from '@tauri-apps/plugin-deep-link'
import * as Gitification from '../index'

const REDIRECT_URI = 'gitification://oauth/callback'

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
    const { data: { access_token: accessToken } } = await Gitification.api.getAccessToken({
      clientId: import.meta.env.VITE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CLIENT_SECRET,
      code,
      redirectUri: REDIRECT_URI,
    })

    const result = await Gitification.api.getUser(accessToken)

    if (result == null) {
      throw new Error('Failed to fetch user data')
    }

    const [user] = result

    if (user == null) {
      throw new Error('GitHub did not return a user')
    }

    const account = { user, accessToken }
    const existingIndex = Gitification.state.users
      .findIndex(({ user: existingUser }) => existingUser.id === user.id)

    if (existingIndex === -1) {
      Gitification.state.users.push(account)
    }
    else {
      Gitification.state.users[existingIndex] = account
    }

    Gitification.state.currentUser = account
    Gitification.router.navigate('home')
    await Gitification.actions.showWindow()
  }
  catch (error) {
    console.error('GitHub OAuth callback failed', error)
  }
  finally {
    processing = false
  }
}

async function handleUrls(urls: string[] | null) {
  if (urls == null) {
    return
  }

  for (const url of urls) {
    await handleUrl(url)
  }
}

export function getRedirectUri() {
  return REDIRECT_URI
}

export function openAuthorization() {
  Gitification.actions.openURL(
    Gitification.utils.github.createCodeCallbackURL(REDIRECT_URI),
  )
}

export async function initialize() {
  const unlisten = await onOpenUrl((urls) => {
    void handleUrls(urls)
  })

  await handleUrls(await getCurrent())

  return unlisten
}
