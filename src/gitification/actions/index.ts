import { exit } from '@tauri-apps/api/process'
import { open } from '@tauri-apps/api/shell'
import * as Gitification from '../index'

export function openURL(url: string) {
  open(url)
}

export function logout() {
  const currentUser = Gitification.storage.get('user')

  if (!currentUser) {
    return
  }

  Gitification.storage.set('allUsers', (prev) => (
    prev.filter((u) => u.id !== currentUser.id)
  ))

  const nextUser = Gitification.storage.get('allUsers').at(0)
  const userAccessTokens = Gitification.storage.get('userAccessTokens')

  if (nextUser && nextUser.id in userAccessTokens) {
    Gitification.storage.assign({
      user: nextUser,
      accessToken: userAccessTokens[nextUser.id],
    })

    return
  }

  Gitification.storage.assign({
    user: null,
    accessToken: null,
  })
  Gitification.router.navigate('landing')
  Gitification.state.threads.value = []
}

export function switchAccount(userId: Gitification.api.Types.SimpleUser['id']) {
  const user = Gitification.storage.get('allUsers').find((u) => u.id === userId)

  if (!user) {
    return
  }

  Gitification.storage.assign({
    user,
    accessToken: Gitification.storage.get('userAccessTokens')[user.id],
  })
}

export function quitApp() {
  exit(0)
}
