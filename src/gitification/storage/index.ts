import * as TauriStore from '@tauri-apps/plugin-store'
import { extendRef } from '@vueuse/core'
import { ref, watch } from 'vue'
import * as Gitification from '../index'
import * as StorageTypes from './types'

export function createStorage() {
  const storePromise = TauriStore.load('.storage.dat', { autoSave: false, defaults: {} })
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
      const store = await storePromise
      await store.set(key, value)
    }

    void storePromise.then((store) => store.save())
  }

  const saveWatchHandle = watch(storage, () => {
    void save()
  }, { flush: 'post', deep: true })

  async function syncFromDisk() {
    saveWatchHandle.pause()

    try {
      const values = await storePromise.then((store) => store.entries())
        .catch(() => [])

      const persistedObject = Object.fromEntries(values)
      let ctx: StorageTypes.AppStorageContextV2

      if (values.length === 0) {
        ctx = storage.value
      }
      else if (persistedObject.version !== storage.value.version) {
        // We need to upgrade from old storage format to new one.
        const oldStorage = persistedObject as unknown as StorageTypes.AppStorageContextV1

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
        void storePromise.then((store) => store.clear())
      }
      else {
        ctx = Object.fromEntries(values) as unknown as StorageTypes.AppStorageContextV2
      }

      Object.assign(storage.value, ctx)
    }
    finally {
      saveWatchHandle.resume()
    }
  }

  return extendRef(storage, {
    syncFromDisk,
    resetSettings() {
      Gitification.actions.requestNotificationPermission()

      storage.value.settings = {
        onlyParticipating: false,
        openAtStartup: false,
        soundsEnabled: false,
        showReadNotifications: false,
        showSystemNotifications: true,
        markAsReadOnOpen: true,
        colorPreference: 'system',
      }
    },
    logDisk() {
      storePromise.then((store) => store.entries()).then((entries) => {
        console.log('Storage entries on disk:', Object.fromEntries(entries))
      })
    },
  })
}

export type Storage = ReturnType<typeof createStorage>

export {
  StorageTypes as Types,
}
