import { createSharedComposable, reactiveComputed } from '@vueuse/core'
import { Fragment, customRef, h, ref } from 'vue'
import { AppStorage } from '../storage'
import { type NotificationReason } from '../constants'

export type Locale = 'en' | 'tr'

const en = {
  navigateToRepository: 'Navigate to repository',
  reloadNotifications: (shortcut: string) => `Reload notifications (${shortcut})`,
  more: 'More',
  changelog: 'Changelog',
  aNewVersionIsAvailable: 'A new version is available!',
  settings: 'Settings',
  signOut: 'Sign out',
  logOut: 'Log out',
  exitApp: 'Exit app',
  itsAllClear: 'It\'s all clear sir!',
  appearance: 'Appearance',
  theme: 'Theme',
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  systemTitle: 'System',
  sounds: 'Sounds',
  openAtStartup: 'Open at startup',
  showSystemNotifications: 'Show system notifications',
  notificationsTitle: 'Notifications',
  showOnlyParticipating: 'Show only participating',
  showReadNotifications: 'Show read notifications',
  markAsReadOnOpen: 'Mark as read on open',
  markAsReadOpenDescription: 'When you open some notifications, Github marks them as read automaticlly, but for some it doesn\'t.',
  welcomeToGitification: 'Welcome to Gitification',
  loginViaGithub: 'Login via Github',
  oopsieCouldntLoad: 'Oopsie! Couldn\'t load notifications',
  refresh: 'Refresh',
  clearSelections: 'Clear selections',
  unsubscribe: 'Unsubscribe',
  open: 'Open',
  markAsRead: 'Mark as read',
  unsubscribeAll: 'Unsubscribe all',
  openAll: 'Open all',
  markAllAsRead: 'Mark all as read',
  selectAll: 'Select all',
  unselectAll: 'Unselect all',
  select: 'Select',
  unselect: 'Unselect',
  gitificationVersionIsAvailable: (version: string) => `Gitification ${version} is available!`,
  currentVersionIs: (version: string) => () => h(Fragment, null, [
    'Current version is ',
    h('b', null, version),
  ]),
  install: 'Install',
  reason: {
    assign: 'Assign',
    author: 'Author',
    comment: 'Comment',
    invitation: 'Invitation',
    manual: 'Manual',
    mention: 'Mention',
    review_requested: 'Review requested',
    security_alert: 'Security alert',
    state_change: 'State change',
    subscribed: 'Subscribed',
    team_mention: 'Team mention',
    ci_activity: 'CI activity',
  } satisfies Record<NotificationReason, string>,
  goBack: (shortcut: string) => `Go back (${shortcut})`,
  language: {
    title: 'Language',
    en: 'English',
    tr: 'Türkçe',
  },
}

const tr: typeof en = {
  navigateToRepository: 'Repoya git',
  reloadNotifications: (shortcut: string) => `Bildirimleri yenile (${shortcut})`,
  more: 'Daha fazla',
  changelog: 'Yenilikler',
  aNewVersionIsAvailable: 'Yeni bir sürüm mevcut!',
  settings: 'Ayarlar',
  signOut: 'Çıkış yap',
  logOut: 'Çıkış yap',
  exitApp: 'Uygulamadan Çık',
  itsAllClear: 'Hepsi okundu!',
  appearance: 'Görünüm',
  theme: 'Tema',
  system: 'Sistem',
  light: 'Açık',
  dark: 'Koyu',
  systemTitle: 'Sistem',
  sounds: 'Sesler',
  openAtStartup: 'Başlangıçta aç',
  showSystemNotifications: 'Sistem bildirimleri göster',
  notificationsTitle: 'Bildirimler',
  showOnlyParticipating: 'Sadece dahil olduklarımı göster',
  showReadNotifications: 'Okunmuş bildirimleri göster',
  markAsReadOnOpen: 'Açınca okundu olarak işaretle',
  markAsReadOpenDescription: 'Bazı bildirimleri açınca Github otomatik olarak okundu olarak işaretliyor ama bazılarını işaretlemiyor. Bu ayar ile her zaman okundu olarak işaretleyebilirsin.',
  welcomeToGitification: 'Gitification\'a hoşgeldin',
  loginViaGithub: 'Github ile giriş yap',
  oopsieCouldntLoad: 'Tüh be! Bildirimler yüklenemedi',
  refresh: 'Yenile',
  clearSelections: 'Seçimleri temizle',
  unsubscribe: 'Aboneliği kaldır',
  open: 'Aç',
  markAsRead: 'Okundu olarak işaretle',
  unsubscribeAll: 'Tümünün aboneliğini kaldır',
  openAll: 'Tümünü aç',
  markAllAsRead: 'Tümünü okundu olarak işaretle',
  selectAll: 'Tümünü seç',
  unselectAll: 'Tüm seçimi kaldır',
  select: 'Seç',
  unselect: 'Seçimi kaldır',
  gitificationVersionIsAvailable: (version: string) => `Gitification ${version} yayında!`,
  currentVersionIs: (version: string) => () => h(Fragment, null, [
    'Şuanki versiyon ',
    h('b', null, version),
  ]),
  install: 'Yükle',
  reason: {
    assign: 'Atama',
    author: 'Yazar',
    comment: 'Yorum',
    invitation: 'Davet',
    manual: 'Manuel',
    mention: 'Bahsetme',
    review_requested: 'İnceleme İstendi',
    security_alert: 'Güvenlik Uyarısı',
    state_change: 'Durum Değişimi',
    subscribed: 'Abone Olundu',
    team_mention: 'Takım bahsetmesi',
    ci_activity: 'CI etkinliği',
  } satisfies Record<NotificationReason, string>,
  goBack: (shortcut: string) => `Geri (${shortcut})`,
  language: {
    title: 'Dil',
    en: 'English',
    tr: 'Türkçe',
  },
}

const localeMap: Record<Locale, typeof en> = { en, tr }

export const useI18n = createSharedComposable(() => {
  const currentLanguage = customRef<Locale>((track, trigger) => {
    const locale = ref<Locale>(AppStorage.get('language'))

    return {
      get() {
        track()
        return locale.value
      },
      set(value) {
        locale.value = value
        AppStorage.set('language', value)
        trigger()
      },
    }
  })

  const t = reactiveComputed(() => localeMap[currentLanguage.value])

  return {
    currentLanguage,
    t,
  }
})
