import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NotificationTypes } from '../constants'
import type { NotificationList } from '../types'

const dummyNotificationData: NotificationList[] = [
  {
    repoFullName: 'kadiryazici/bottom-sheet-vue3',
    children: [
      {
        id: '12',
        title: 'feat: Add typing test',
        type: NotificationTypes.Mention,
        url: 'https://github.com/antfu/unplugin-icons',
      },
      {
        id: '122334',
        title: 'It does not work',
        type: NotificationTypes.Author,
        url: 'https://github.com/antfu/unplugin-icons',
      },
      {
        id: '122334',
        title: 'It does not work',
        type: NotificationTypes.Author,
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
        type: NotificationTypes.Mention,
        url: 'https://github.com/antfu/unplugin-icons',
      },
      {
        id: '122334',
        title: 'It does not work',
        type: NotificationTypes.Author,
        url: 'https://github.com/antfu/unplugin-icons',
      },
    ],
  },
]

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationList[]>(dummyNotificationData.slice(0))

  return {
    notifications,
  }
})
