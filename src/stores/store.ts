import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NotificationTypes } from '../constants'
import type { NotificationItem } from '../types'

const dummyNotificationData: NotificationItem[] = [
  {
    id: '12',
    repoFullName: 'kadiryazici/vue-type-fast',
    title: 'feat: Add typing test',
    type: NotificationTypes.Mention,
    url: 'https://github.com/antfu/unplugin-icons',
  },
  {
    id: '122334',
    repoFullName: 'kadiryazici/bottom-sheet-vue3',
    title: 'It does not work',
    type: NotificationTypes.Author,
    url: 'https://github.com/antfu/unplugin-icons',
  },
]

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationItem[]>(dummyNotificationData.slice(0))

  function removeNotification(id: string) {
    const index = notifications.value.findIndex(notification => notification.id === id)
    if (index >= 0)
      notifications.value.splice(index, 1)
  }

  return {
    notifications,
    removeNotification,
  }
})
