import { invoke } from '@tauri-apps/api/tauri'
import { defineStore } from 'pinia'
import { readonly, ref, shallowRef, watch } from 'vue'
import type { Thread } from '../api/notifications'
import { getNotifications } from '../api/notifications'
import { InvokeCommand, Page } from '../constants'
import { AppStorage } from '../storage'
import type { NotificationListData, Option, PageState } from '../types'
import { notificationListFromThreads } from '../utils/notification'

function hasNewNotification(newThreads: Thread[], previousThreads: Thread[]) {
  const newThreadsFiltered = newThreads.filter(t => t.unread)
  const previousThreadsFiltered = previousThreads.filter(t => t.unread)
  return !newThreadsFiltered.every(newT => previousThreadsFiltered.some(prevT => prevT.id === newT.id))
}

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationListData[]>([])
  const loadingNotifications = ref(false)
  const failedLoadingNotifications = ref(false)
  const skeletonVisible = ref(false)

  let notificationsRaw: Thread[] = []
  let notificationsRawPrevious: Thread[] = []

  async function fetchNotifications(withSkeletons = false) {
    if (loadingNotifications.value)
      return

    const accessToken = AppStorage.get('accessToken')

    if (accessToken == null)
      return

    if (withSkeletons)
      skeletonVisible.value = true

    loadingNotifications.value = true
    failedLoadingNotifications.value = false

    try {
      const { data } = await getNotifications({
        accessToken,
        showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
        showReadNotifications: AppStorage.get('showReadNotifications'),
      })

      notificationsRawPrevious = notificationsRaw
      notificationsRaw = data
      notifications.value = notificationListFromThreads(data)
    }
    catch (error) {
      console.error('NotificationError: ', error)
      notifications.value = []
      failedLoadingNotifications.value = true
    }

    loadingNotifications.value = false
    skeletonVisible.value = false

    if (
      AppStorage.get('soundsEnabled')
      && hasNewNotification(notificationsRaw, notificationsRawPrevious)
    )
      invoke(InvokeCommand.PlayNotificationSound)
  }

  const currentPage = ref(Page.Landing)
  const pageFrom = ref<Option<Page>>(null)
  const currentPageState = shallowRef<PageState>({})

  function logout() {
    AppStorage.set('accessToken', null)
    AppStorage.set('user', null)
    notifications.value = []
    currentPage.value = Page.Landing
  }

  function setPage(to: Page, state: PageState = {}) {
    if (to === currentPage.value)
      return

    pageFrom.value = currentPage.value
    currentPage.value = to
    currentPageState.value = state
  }

  watch(notifications, () => {
    const hasUnread = notificationsRaw.some(n => n.unread)
    invoke(InvokeCommand.SetIconTemplate, { isTemplate: !hasUnread })
  }, { deep: true, immediate: true })

  return {
    notifications,
    currentPage: readonly(currentPage),
    setPage,
    loadingNotifications,
    skeletonVisible,
    pageFrom,
    failedLoadingNotifications,
    currentPageState,
    fetchNotifications,
    logout,
  }
})
