import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import { getNotifications } from '../api/notifications'
import { Page } from '../constants'
import { AppStorage } from '../storage'
import type { NotificationListData, Option } from '../types'
import { notificationListFromThreads } from '../utils/notification'

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationListData[]>([])
  const loadingNotifications = ref(false)
  const skeletonVisible = ref(false)

  async function fetchNotifications(withSkeletons = false) {
    if (loadingNotifications.value)
      return

    const accessToken = AppStorage.get('accessToken')

    if (accessToken == null)
      return

    if (withSkeletons)
      skeletonVisible.value = true

    loadingNotifications.value = true

    try {
      const { data } = await getNotifications({
        accessToken,
        showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
        showReadNotifications: AppStorage.get('showReadNotifications'),
      })

      notifications.value = notificationListFromThreads(data)
    }
    catch (error) {
      console.error('NotificationError: ', error)
      notifications.value = []
    }
    finally {
      loadingNotifications.value = false
      skeletonVisible.value = false
    }
  }

  const currentPage = ref(Page.Landing)
  const pageFrom = ref<Option<Page>>(null)

  function logout() {
    AppStorage.set('accessToken', null)
    notifications.value = []
    currentPage.value = Page.Landing
  }

  function setPage(to: Page) {
    if (to === currentPage.value)
      return

    pageFrom.value = currentPage.value
    currentPage.value = to
  }

  return {
    notifications,
    currentPage: readonly(currentPage),
    setPage,
    loadingNotifications,
    skeletonVisible,
    pageFrom,
    fetchNotifications,
    logout,
  }
})
