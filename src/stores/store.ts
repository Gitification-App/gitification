import { sendNotification } from '@tauri-apps/api/notification'
import { invoke } from '@tauri-apps/api/tauri'
import { defineStore } from 'pinia'
import { ref, watchEffect } from 'vue'
import pAll from 'p-all'
import { type UpdateManifest, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { klona } from 'klona'
import { type MinimalRepository, type Thread, getNotifications, markNotificationAsRead, unsubscribeNotification } from '../api/notifications'
import { CheckedNotificationProcess, InvokeCommand, notificationApiMutex } from '../constants'
import { AppStorage } from '../storage'
import type { NotificationList, Option } from '../types'
import { isRepository, isThread, toNotificationList } from '../utils/notification'
import { everySome } from '../utils/array'
import { Page, useRoute } from '../composables/useRoute'

export const useStore = defineStore('store', () => {
  const notifications = ref<NotificationList>([])
  const loadingNotifications = ref(false)
  const failedLoadingNotifications = ref(false)
  const skeletonVisible = ref(false)

  function removeNotificationById(id: Thread['id']) {
    const index = notifications.value.findIndex(item => isThread(item) && item.id === id)
    const thread = notifications.value[index] as Thread
    notifications.value.splice(index, 1)

    const repoHasNotifications = notifications.value.some(item => isThread(item) && item.repository.id === thread.repository.id)
    if (!repoHasNotifications) {
      const repoIndex = notifications.value.findIndex(item => isRepository(item) && item.id === thread.repository.id)
      notifications.value.splice(repoIndex, 1)
    }
  }

  const checkedItems = ref<Thread[]>([])

  const route = useRoute()

  function logout() {
    AppStorage.set('accessToken', null)
    AppStorage.set('user', null)
    notifications.value = []
    route.go(Page.Landing)
  }

  watchEffect(() => {
    const hasUnread = notifications.value.some(n => isThread(n) && n.unread)
    invoke(InvokeCommand.SetIconTemplate, { isTemplate: !hasUnread })
  })

  /**
   * Creates a snapshot of current notifications state, if given promise failes, it will restore the snapshot
   * if not, it will do nothing.
   *
   * It uses mutex.
   */
  async function runWithSnapshot(fn: () => Promise<void>) {
    const snapshot = notifications.value.slice(0)

    try {
      await notificationApiMutex.runExclusive(fn)
    }
    catch (error) {
      console.error(error)
      notifications.value = snapshot
    }
  }

  function createSnapshot() {
    return klona(notifications.value)
  }

  function processCheckedNotifications(process: CheckedNotificationProcess) {
    return notificationApiMutex.runExclusive(async () => {
      const deletedThreads: Thread[] = []
      const checkedThreads = checkedItems.value
      const snapshot = notifications.value.slice(0)
      const accessToken = AppStorage.get('accessToken')!

      if (AppStorage.get('showReadNotifications')) {
        checkedThreads.forEach(thread => thread.unread = false)
      }
      else {
        checkedThreads.forEach(thread => removeNotificationById(thread.id))
      }

      checkedItems.value = []

      try {
        await pAll(
          checkedThreads.map(thread => async () => {
            if (process === CheckedNotificationProcess.MarkAsRead) {
              await markNotificationAsRead(thread.id, accessToken)
            }
            else if (process === CheckedNotificationProcess.Unsubscribe) {
              await unsubscribeNotification(thread.id, accessToken)
            }

            deletedThreads.push(thread)
          }),
          {
            stopOnError: false,
            concurrency: 7,
          },
        )
      }
      catch (error) {
        notifications.value = snapshot

        deletedThreads.forEach((thread) => {
          if (!AppStorage.get('showReadNotifications')) {
            removeNotificationById(thread.id)
          }
          else {
            thread.unread = false
          }
        })
      }
    })
  }

  const newRelease = ref<Option<UpdateManifest>>(null)
  const installingUpate = ref(false)

  async function updateAndRestart() {
    if (newRelease.value == null) {
      return
    }

    try {
      installingUpate.value = true
      await installUpdate()
      await relaunch()
      installingUpate.value = false
    }
    catch (error) {
      console.error(error)
      installingUpate.value = false
    }
  }

  function isChecked(item: MinimalRepository | Thread | null) {
    if (item == null || !isCheckable(item)) {
      return false
    }

    if (isRepository(item)) {
      return notifications.value
        .filter(isThread)
        .filter(thread => thread.unread && thread.repository.id === item.id)
        .every(thread => (
          checkedItems.value.some(checkedItem => checkedItem.id === thread.id)
        ))
    }

    return checkedItems.value
      .some(checkedItem => checkedItem.id === item.id)
  }

  function setChecked(item: MinimalRepository | Thread, value: boolean) {
    const checked = isChecked(item)

    if (value === checked) {
      return
    }

    if (value) {
      if (isRepository(item)) {
        for (const notificationItem of notifications.value) {
          if (isThread(notificationItem) && notificationItem.unread && notificationItem.repository.id === item.id) {
            checkedItems.value.push(notificationItem)
          }
        }
        return
      }

      checkedItems.value.push(item)
      return
    }

    if (isRepository(item)) {
      checkedItems.value = checkedItems.value.filter(checkedItem => (
        checkedItem.repository.id !== item.id
      ))
      return
    }

    const index = checkedItems.value.findIndex(checkedItem => checkedItem.id === item.id)
    checkedItems.value.splice(index, 1)
  }

  function isCheckable(item: MinimalRepository | Thread) {
    if (isThread(item)) {
      return item.unread
    }

    return notifications.value
      .filter(isThread)
      .filter(thread => thread.repository.id === item.id)
      .some(thread => thread.unread)
  }

  function isIndeterminate(item: MinimalRepository | Thread): boolean {
    if (isThread(item)) {
      return false
    }

    const repoThreads = notifications.value
      .filter(isThread)
      .filter(thread => thread.unread && thread.repository.id === item.id)

    const { every, some } = everySome(repoThreads, thread => (
      checkedItems.value.some(checkedItem => checkedItem.id === thread.id)
    ))

    return some && !every
  }

  function getThreadsOfRepository(repository: MinimalRepository) {
    return notifications.value
      .filter(isThread)
      .filter(thread => thread.repository.id === repository.id)
  }

  return {
    newRelease,
    notifications,
    loadingNotifications,
    skeletonVisible,
    failedLoadingNotifications,
    checkedItems,
    installingUpate,
    createSnapshot,
    getThreadsOfRepository,
    isChecked,
    setChecked,
    isCheckable,
    isIndeterminate,
    runWithSnapshot,
    updateAndRestart,
    removeNotificationById,
    processCheckedNotifications,
    logout,
  }
})
