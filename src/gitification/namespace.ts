import * as Constants from '../constants'
import { createRouter } from './router'
import { createState } from './state'
import { createStorage } from './storage'

export * as utils from './utils'
export { Constants }
export const state = createState()
export const router = createRouter('landing')
export const storage = createStorage()
