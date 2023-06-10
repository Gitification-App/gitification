import { Store } from 'tauri-plugin-store-api'
import type { WritableComputedRef } from 'vue'
import { computed, shallowReactive } from 'vue'
import type { AppStorageContext } from './types'
import { batchFn } from './utils/batch'
import { ColorPreference } from './constants'

const store = new Store('.storage.dat')
const storage = shallowReactive<AppStorageContext>({
  user: null,
  accessToken: null,
  showOnlyParticipating: false,
  openAtStartup: false,
  soundsEnabled: true,
  showReadNotifications: false,
  showSystemNotifications: false,
  markAsReadOnOpen: false,
  colorPreference: ColorPreference.System,
})

const writeStorageToDisk = batchFn(() => (
  store.save()
))

export const AppStorage = {
  /**
   * Reads from storage, can be used inside computed for reactivity
   */
  get<T extends keyof AppStorageContext>(key: T): AppStorageContext[T] {
    return storage[key]
  },

  /**
   * Writes to storage and in next event loop, caches to disk
   */
  set<T extends keyof AppStorageContext>(key: T, value: AppStorageContext[T]) {
    if (value === storage[key])
      return

    storage[key] = value

    store.set(key, value).then(() => writeStorageToDisk())
  },

  /**
   * Same as calling AppStorage.get/AppStorage.set but as reactive reference.
   * Mutating `.value` calls AppStorage.set
   * Accessing `.value` calls AppStorage.get
   */
  asRef<T extends keyof AppStorageContext>(key: T): WritableComputedRef<AppStorageContext[T]> {
    return computed({
      get() {
        return AppStorage.get(key)
      },
      set(value) {
        AppStorage.set(key, value)
      },
    })
  },

  /**
   * Reactive read to data of key
   */
  asComputed<T extends keyof AppStorageContext>(key: T): WritableComputedRef<AppStorageContext[T]> {
    return computed(() => AppStorage.get(key))
  },
}

/**
 * Reads storage from disk and saves values to app cache.
 */
export async function cacheStorageFromDisk() {
  const values = Object.fromEntries(await store.entries())

  console.log('disk storage value: ', values)

  for (const key of Object.keys(storage)) {
    const value = values[key]

    if (value != null)
      // @ts-expect-error Type issue
      storage[key] = value
  }
}
