import type { Ref } from 'vue'
import type { User } from './api/user'
import type { Locale } from './composables/useI18n'
import type { ColorPreference } from './constants'
import type { Gitification } from './gitification'

export type Option<T> = T | null
export type MaybeRef<T> = T | Ref<T>

export type NotificationList = (Gitification.Types.Api.Thread | Gitification.Types.Api.MinimalRepository)[]

export type AppStorageContext = {
  user: Option<User>
  accessToken: Option<string>
  showOnlyParticipating: boolean
  openAtStartup: boolean
  soundsEnabled: boolean
  showReadNotifications: boolean
  showSystemNotifications: boolean
  markAsReadOnOpen: boolean
  colorPreference: ColorPreference
  language: Locale
}
