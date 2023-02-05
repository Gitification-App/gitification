import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NotificationReason, Page } from '../constants'
import { AppStorage } from '../storage'
import type { NotificationList } from '../types'

const dummyNotificationData: NotificationList[] = [
  {
    repoFullName: 'kadiryazici/bottom-sheet-vue3',
    children: [
      {
        id: '12',
        title: 'feat: Add typing test',
        reason: NotificationReason.Mention,
        url: 'https://github.com/antfu/unplugin-icons',
      },
      {
        id: '122334',
        title: 'It does not work',
        reason: NotificationReason.Author,
        url: 'https://github.com/antfu/unplugin-icons',
      },
      {
        id: '122334',
        title: 'It does not work',
        reason: NotificationReason.Author,
        url: 'https://github.com/antfu/unplugin-icons',
      },
    ],
  },
  {
    repoFullName: 'kadiryazici/bottom-sheet-vue3',
    children: [
      {
        id: '12',
        title: 'feat: Add typing test',
        reason: NotificationReason.Mention,
        url: 'https://github.com/antfu/unplugin-icons',
      },
      {
        id: '122334',
        title: 'It does not work',
        reason: NotificationReason.Author,
        url: 'https://github.com/antfu/unplugin-icons',
      },
    ],
  },
]

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationList[]>(dummyNotificationData.slice(0))
  const currentPage = ref(Page.Landing)

  function logout() {
    AppStorage.set('accessToken', null)
    // notifications.value = []
    currentPage.value = Page.Landing
  }

  return {
    notifications,
    currentPage,
    logout,
  }
})
