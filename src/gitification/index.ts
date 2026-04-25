import { createRouter } from './router'
import { createState } from './state'
import { createStorage } from './storage'

export * as actions from './actions'
export * as api from './api'
export * as mock from './mock'
export * as server from './server'
export * as utils from './utils'

export const state = createState()
export const router = createRouter('landing')
export const storage = createStorage()
