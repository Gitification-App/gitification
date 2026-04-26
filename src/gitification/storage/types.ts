// #NamespaceName: StorageTypes

import type { Option } from '../../types'
import type * as Gitification from '../index'

export type AppStorageContextV1 = {
  user: Option<Gitification.api.Types.SimpleUser>
  accessToken: Option<string>
  showOnlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  showReadNotifications: boolean
  showSystemNotifications: boolean
  markAsReadOnOpen: boolean
  colorPreference: ColorPreference
  allUsers: Gitification.api.Types.SimpleUser[]
  userAccessTokens: Record<Gitification.api.Types.SimpleUser['id'], string>
}

export type StorageUser = {
  user: Gitification.api.Types.SimpleUser
  accessToken: string
}

export type ColorPreference = 'light' | 'dark' | 'system'

export type StorageSettings = {
  onlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  showReadNotifications: boolean
  showSystemNotifications: boolean
  markAsReadOnOpen: boolean
  colorPreference: ColorPreference
}

export type AppStorageContextV2 = {
  version: number
  activeUserId: Option<Gitification.api.Types.SimpleUser['id']>
  users: StorageUser[]
  settings: StorageSettings
}
