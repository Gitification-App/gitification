import { getCurrentScope, onScopeDispose } from 'vue'
import * as Gitification from '../gitification'

export function useOauthListener() {
  let unlisten: (() => void) | null = null
  let disposed = false

  void Gitification.auth.initialize().then((cleanup) => {
    if (disposed) {
      cleanup()
      return
    }

    unlisten = cleanup
  })

  if (getCurrentScope()) {
    onScopeDispose(() => {
      disposed = true
      unlisten?.()
    })
  }
}
