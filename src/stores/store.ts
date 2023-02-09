import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'
import type { Thread } from '../api/notifications'
import { getNotifications } from '../api/notifications'
import { Page } from '../constants'
import { AppStorage } from '../storage'
import type { NotificationList, Option } from '../types'

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationList[]>([])
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

    try {
      const { data } = await getNotifications({
        accessToken,
        showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
        showReadNotifications: AppStorage.get('showReadNotifications'),
      })

      notifications.value = []
      const notificationsByRepo = new Map<Thread['repository']['id'], Thread[]>()

      data.forEach((notification) => {
        const { repository } = notification

        if (!(notificationsByRepo.has(repository.id)))
          notificationsByRepo.set(repository.id, [])

        const thread = notificationsByRepo.get(repository.id)!

        thread.push(notification)
      })

      for (const [, threads] of notificationsByRepo) {
        notifications.value.push({
          repoFullName: threads[0].repository.full_name,
          threads,
        })
      }

      skeletonVisible.value = false
    }
    catch (error) {
      console.error('NotificationError: ', error)
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
