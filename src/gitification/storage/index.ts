import { extendRef } from '@vueuse/core'
import { Store } from 'tauri-plugin-store-api'
import { ref, watch } from 'vue'
import * as StorageTypes from './types'

export function createStorage() {
  const store = new Store('.storage.dat')
  const storage = ref<StorageTypes.AppStorageContextV2>({
    version: 2,
    activeUserId: null,
    users: [],
    settings: {
      onlyParticipating: false,
      openAtStartup: false,
      soundsEnabled: false,
      showReadNotifications: false,
      showSystemNotifications: true,
      markAsReadOnOpen: true,
      colorPreference: 'system',
    },
  })

  async function save() {
    for (const [key, value] of Object.entries(storage.value)) {
      await store.set(key, value)
    }

    void store.save()
  }

  const saveWatchHandle = watch(storage, () => {
    void save()
  }, { flush: 'post', deep: true })

  async function syncFromDisk() {
    saveWatchHandle.pause()

    try {
      const values = await store.entries()
        .catch(() => [])

      let ctx: StorageTypes.AppStorageContextV2

      if (values.length === 0) {
        ctx = storage.value
      }
      else if (values.some(([key]) => key === 'markAsReadOnOpen')) {
      // We need to upgrade from old storage format to new one.

        const oldStorage = Object.fromEntries(values) as unknown as StorageTypes.AppStorageContextV1
        ctx = {
          ...storage.value,
          activeUserId: oldStorage.user?.id ?? null,
          users: (oldStorage.user == null || oldStorage.accessToken == null)
            ? []
            : [{
                user: oldStorage.user,
                accessToken: oldStorage.accessToken ?? '',
              }],
          settings: Object.keys(storage.value.settings)
            .reduce((settings, key) => {
              const value = Reflect.get(oldStorage, key)

              if (value != null) {
                Reflect.set(settings, key, value)
              }

              return settings
            }, { ...storage.value.settings } as StorageTypes.StorageSettings),
        }
        store.clear()
      }
      else {
        ctx = Object.fromEntries(values) as unknown as StorageTypes.AppStorageContextV2
      }

      storage.value = ctx
    }
    finally {
      saveWatchHandle.resume()
    }
  }

  return extendRef(storage, {
    syncFromDisk,
    logDisk() {
      store.entries().then((entries) => {
        console.log('Storage entries on disk:', Object.fromEntries(entries))
      })
    },
  })
}

export type Storage = ReturnType<typeof createStorage>

export {
  StorageTypes as Types,
}
