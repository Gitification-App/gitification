import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Thread } from '../api/notifications'
import { getNotifications } from '../api/notifications'
import type { NotificationReason, NotificationSubject } from '../constants'
import { Page } from '../constants'
import { AppStorage } from '../storage'
import type { NotificationList } from '../types'

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationList[]>()
  const fetchingNotifications = ref(false)
  const currentPage = ref(Page.Landing)

  function logout() {
    AppStorage.set('accessToken', null)
    // notifications.value = []
    currentPage.value = Page.Landing
  }

  async function fetchNotifications() {
    if (fetchingNotifications.value)
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

      for (const [, thread] of notificationsByRepo) {
        notifications.value.push({
          repoFullName: thread[0].repository.full_name,
          children: thread.map(item => ({
            id: item.id,
            title: item.subject.title,
            url: item.subject.url,
            reason: item.reason as NotificationReason,
            subject: item.subject.type as NotificationSubject,
          })),
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
    fetchingNotifications,
    fetchNotifications,
    logout,
  }
})
