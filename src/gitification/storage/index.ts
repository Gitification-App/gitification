import type { Ref } from 'vue'
import type { AppStorageContext } from '../../types'
import { Store } from 'tauri-plugin-store-api'
import { customRef, shallowReactive } from 'vue'
import * as Constants from '../constants/index'

export function createStorage() {
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
    colorPreference: Constants.ColorPreference.System,
    language: 'en',
  })

  let willSave = false

  async function save() {
    if (willSave) {
      return
    }

    willSave = true
    setTimeout(async () => {
      try {
        await store.save()
      }
      finally {
        willSave = false
      }
    }, 0)
  }

  async function syncFromDisk() {
    const values = Object.fromEntries(await store.entries()) as AppStorageContext

    for (const key of Object.keys(storage) as (keyof AppStorageContext)[]) {
      const value = values[key]

      if (value != null) {
        Reflect.set(storage, key, value)
      }
    }
  }

  type Key = keyof AppStorageContext
  type Value<K extends Key> = AppStorageContext[K]

  function get<K extends Key>(key: K): Value<K> {
    return storage[key]
  }

  function set<K extends Key>(key: K, value: Value<K>) {
    if (value === storage[key]) {
      return
    }

    storage[key] = value
    store.set((key as string), value)
      .then(save)
  }

  function asRef<K extends Key>(key: K): Ref<Value<K>> {
    return customRef((track, trigger) => ({
      get() {
        track()
        return get(key)
      },
      set(value) {
        if (value === storage[key]) {
          return
        }

        set(key, value)
        trigger()
      },
    }))
  }

  function assign(newValues: Partial<AppStorageContext>) {
    for (const key of Object.keys(newValues) as Key[]) {
      const value = newValues[key]

      if (value != null) {
        set(key, value)
      }
    }
  }

  return {
    get,
    set,
    assign,
    asRef,
    save,
    syncFromDisk,
  }
}

export type Storage = ReturnType<typeof createStorage>
