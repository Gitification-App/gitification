import { computed, onScopeDispose, shallowRef } from 'vue'
import { Store } from 'tauri-plugin-store-api'
import type { StorageKey } from '../constants'
import type { Option } from '../types'

export const storage = new Store('.storage.dat')

export async function useStorageRef<T>(key: StorageKey, fallback: T) {
  const value = shallowRef(fallback)

  let eventCleanFn: Option<() => void> = null
  let disposed = false

  onScopeDispose(() => {
    eventCleanFn?.()
    disposed = true
  })

  storage
    .onKeyChange<T>(key, (newValue) => { value.value = newValue ?? fallback })
    .then((cleanup) => {
      if (disposed) {
        cleanup()
        return
      }

      eventCleanFn = cleanup
    })

  value.value = await storage.get<T | null>(key) ?? fallback

  return computed({
    get() {
      return value.value
    },
    set(newValue) {
      if (newValue === value.value)
        return

      value.value = newValue
      storage.set(key, newValue).then(() => storage.save())
    },
  })
}
