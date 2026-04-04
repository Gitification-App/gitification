import type { Ref } from 'vue'
import type { MinimalRepository, Thread } from './api/notifications'
import type { User } from './api/user'
import type { Locale } from './composables/useI18n'
import type { ColorPreference } from './constants'

export type Option<T> = T | null
export type MaybeRef<T> = T | Ref<T>

export type NotificationList = (Thread | MinimalRepository)[]

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
