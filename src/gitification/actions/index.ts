import { open } from '@tauri-apps/api/shell'
import { Gitification } from '..'

export function openURL(url: string) {
  open(url)
}

export function logout() {
  Gitification.router.navigate('landing')
  Gitification.storage.assign({ accessToken: null, user: null })
  Gitification.state.threads.value = []
}
