import type { Ref } from 'vue'
import type { MinimalRepository, Thread } from './api/notifications'
import type { User } from './api/user'
import { type ColorPreference } from './constants'
import { type Locale } from './composables/useI18n'

export type Option<T> = T | null
export type MaybeRef<T> = T | Ref<T>

export type NotificationList = (Thread | MinimalRepository)[]

export interface AppStorageContext {
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

export interface PageState {
  fetchOnEnter?: boolean
}
