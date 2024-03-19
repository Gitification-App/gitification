import { createSharedComposable } from '@vueuse/core'
import { invoke } from '@tauri-apps/api'
import { sendNotification } from '@tauri-apps/api/notification'
import { open as shellOpen } from '@tauri-apps/api/shell'
import { type MinimalRepository, type Thread, getNotifications, markNotificationAsRead, unsubscribeNotification } from '../api/notifications'
import { useStore } from '../stores/store'
import { filterNewNotifications, isRepository, isThread, toNotificationList } from '../utils/notification'
import { AppStorage } from '../storage'
import { InvokeCommand } from '../constants'
import { createGithubWebURL } from '../utils/github'

export const useCommonCalls = createSharedComposable(() => {
  const store = useStore()

  function getThreadsToProcess(target: Thread | MinimalRepository) {
    let threads = [] as Thread[]

    if (isRepository(target)) {
      threads = store.getThreadsOfRepository(target)
    }
    else if (store.isChecked(target)) {
      threads = [...store.checkedItems]
      store.checkedItems = []
    }
    else {
      threads = [target]
    }

    return threads
  }

  function markAsRead(target: MinimalRepository | Thread | Thread[]) {
    let threads = [] as Thread[]

    if (isRepository(target) || isThread(target)) {
      threads = getThreadsToProcess(target)
    }
    else {
      threads = target
    }

    for (const thread of threads) {
      if (!thread.unread) {
        continue
      }

      if (AppStorage.get('showReadNotifications')) {
        thread.unread = false
      }
      else {
        store.removeNotificationById(thread.id)
      }

      markNotificationAsRead(thread.id, AppStorage.get('accessToken')!)
    }
  }

  function open(target: Thread | MinimalRepository) {
    const threads = getThreadsToProcess(target)

    for (const thread of threads) {
      const url = createGithubWebURL({ notification: thread, userId: AppStorage.get('user')!.id })
      shellOpen(url)
    }

    if (AppStorage.get('markAsReadOnOpen')) {
      markAsRead(threads)
    }
  }

  function unsubscribeThreadOrRepo(target: Thread | MinimalRepository) {
    const threads = getThreadsToProcess(target)

    for (const thread of threads) {
      unsubscribeNotification(thread.id, AppStorage.get('accessToken')!)
    }

    markAsRead(threads)
  }

  async function fetchThreads(withSkeletons = false) {
    if (store.loadingNotifications) {
      return
    }

    const accessToken = AppStorage.get('accessToken')

    if (accessToken == null) {
      return
    }

    const previousThreads = store.notifications.filter(isThread)

    if (withSkeletons) {
      store.skeletonVisible = true
      store.notifications = []
    }

    store.loadingNotifications = true
    store.failedLoadingNotifications = false

    try {
      const { data } = await getNotifications({
        accessToken,
        showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
        showReadNotifications: AppStorage.get('showReadNotifications'),
      })

      const threadSet = new Set(data.map(thread => thread.id))

      store.checkedItems = store.checkedItems.filter(thread => threadSet.has(thread.id))
      store.notifications = toNotificationList(data)
    }
    catch (error) {
      store.notifications = []
      store.failedLoadingNotifications = true
      store.checkedItems = []
    }

    store.loadingNotifications = false
    store.skeletonVisible = false

    const newNotifications = filterNewNotifications(previousThreads, store.notifications.filter(isThread))

    if (newNotifications.length > 0) {
      if (AppStorage.get('soundsEnabled')) {
        invoke(InvokeCommand.PlayNotificationSound)
      }

      if (AppStorage.get('showSystemNotifications')) {
        sendNotification({
          title: newNotifications[0].repository.full_name,
          body: newNotifications[0].subject.title,
        })
      }
    }
  }

  return {
    markAsRead,
    open,
    unsubscribeThreadOrRepo,
    fetchThreads,
  }
})
