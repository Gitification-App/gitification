import type { Event, EventName } from '@tauri-apps/api/event'
import { listen } from '@tauri-apps/api/event'
import { getCurrentScope, onScopeDispose } from 'vue'
import type { Option } from '../types'

export function useTauriEvent<T>(key: EventName, callback: (payload: Event<T>) => void) {
  let unlistenFn: Option<() => void> = null
  let disposed = false

  if (getCurrentScope()) {
    onScopeDispose(() => {
      unlistenFn?.()
      disposed = true
    })
  }

  listen(key, callback).then((cleanup) => {
    if (disposed)
      cleanup()

    unlistenFn = cleanup
  })

  return () => {
    unlistenFn?.()
  }
}
