import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Thread } from '../api/notifications'
import { getNotifications } from '../api/notifications'
import { Page } from '../constants'
import { AppStorage } from '../storage'
import type { NotificationList } from '../types'

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationList[]>()
  const loadingNotifications = ref(false)
  const currentPage = ref(Page.Landing)

  function logout() {
    AppStorage.set('accessToken', null)
    // notifications.value = []
    currentPage.value = Page.Landing
  }

  async function fetchNotifications() {
    if (loadingNotifications.value)
      return

    const accessToken = AppStorage.get('accessToken')

    if (accessToken == null)
      return

    try {
      const { data } = await getNotifications({ accessToken, showOnlyParticipating: AppStorage.get('showOnlyParticipating') })
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
    }
    catch (error) {
      console.error('NotificationError: ', error)
    }
  }

  return {
    notifications,
    currentPage,
    loadingNotifications,
    fetchNotifications,
    logout,
  }
})
