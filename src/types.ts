import type { Ref } from 'vue'
import type { Locale } from './composables/useI18n'
import type { ColorPreference } from './constants'
import type * as Gitification from './gitification/index'

export type Option<T> = T | null
export type MaybeRef<T> = T | Ref<T>

export type NotificationList = (Gitification.api.Types.Thread | Gitification.api.Types.MinimalRepository)[]

export type AppStorageContext = {
  user: Option<Gitification.api.Types.SimpleUser>
  accessToken: Option<string>
  showOnlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  showReadNotifications: boolean
  showSystemNotifications: boolean
  markAsReadOnOpen: boolean
  colorPreference: ColorPreference
  language: Locale
  allUsers: Gitification.api.Types.SimpleUser[]
  userAccessTokens: Record<Gitification.api.Types.SimpleUser['id'], string>
}
