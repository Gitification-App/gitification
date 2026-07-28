import { fetch as tFetch } from '@tauri-apps/plugin-http'
import { createActions } from './actions'
import { createApi } from './api'
import { createAuth } from './auth'
import { createRouter } from './router'
import { createState } from './state'
import { createStorage } from './storage'
import * as StorageTypes from './storage/types'
import { createTauriLayer } from './tauri'

export { default as i18n } from './i18n'
export * as utils from './utils'

export const storage = createStorage({})
export const state = createState({ storage })
export const router = createRouter({ defaultPage: 'landing' })
export const tauri = createTauriLayer()
export const api = createApi({
  nativeFetch: tFetch,
})
export const actions = createActions({
  state,
  storage,
  api,
  router,
  tauri,
})
export const auth = createAuth({
  api,
  actions,
  router,
  state,
  tauri,
})
export { StorageTypes }
