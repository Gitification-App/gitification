// #NamespaceName: StorageTypes

import type { Option } from '../../types'
import type { Types as ApiTypes } from '../api'

export type AppStorageContextV1 = {
  user: Option<ApiTypes.SimpleUser>
  accessToken: Option<string>
  showOnlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  showReadNotifications: boolean
  showSystemNotifications: boolean
  markAsReadOnOpen: boolean
  colorPreference: ColorPreference
  allUsers: ApiTypes.SimpleUser[]
  userAccessTokens: Record<ApiTypes.SimpleUser['id'], string>
}

export type StorageUser = {
  user: ApiTypes.SimpleUser
  accessToken: string
}

export type ColorPreference = 'light' | 'dark' | 'system'

export type StorageSettings = {
  onlyParticipating: boolean
  openAtStartup: boolean
  pollInterval: 30 | 60 | 90 | 120
  soundsEnabled: boolean
  showReadNotifications: boolean
  showSystemNotifications: boolean
  markAsReadOnOpen: boolean
  colorPreference: ColorPreference
}

export type AppStorageContextV2 = {
  version: number
  activeUserId: Option<ApiTypes.SimpleUser['id']>
  users: StorageUser[]
  settings: StorageSettings
}
