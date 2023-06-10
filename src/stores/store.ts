import { sendNotification } from '@tauri-apps/api/notification'
import { invoke } from '@tauri-apps/api/tauri'
import { defineStore } from 'pinia'
import { readonly, ref, shallowRef, triggerRef, watchEffect } from 'vue'
import pAll from 'p-all'
import { type UpdateManifest, installUpdate } from '@tauri-apps/api/updater'
import { relaunch } from '@tauri-apps/api/process'
import { type Thread, getNotifications, markNotificationAsRead, unsubscribeNotification } from '../api/notifications'
import { InvokeCommand, Page, notificationApiMutex } from '../constants'
import { AppStorage } from '../storage'
import type { AppStorageContext, NotificationList, Option, PageState } from '../types'
import { filterNewThreads, isRepository, isThread, toNotificationList } from '../utils/notification'

export const useStore = defineStore('store', () => {
  const notifications = shallowRef<NotificationList>([])
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

    triggerRef(notifications)
  }

  let threadsRaw: Thread[] = []
  let threadsPreviousRaw: Thread[] = []

  const checkedItems = ref<Thread[]>([])

  async function fetchNotifications(withSkeletons = false) {
    if (loadingNotifications.value)
      return

    const accessToken = AppStorage.get('accessToken')

    if (accessToken == null)
      return

    if (withSkeletons) {
      skeletonVisible.value = true
      notifications.value = []
    }

    loadingNotifications.value = true
    failedLoadingNotifications.value = false

    try {
      const checkedThreads = checkedItems.value

      const { data } = await notificationApiMutex.runExclusive(() => getNotifications({
        accessToken,
        showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
        showReadNotifications: AppStorage.get('showReadNotifications'),
      }))

      threadsPreviousRaw = threadsRaw
      threadsRaw = data

      notifications.value = toNotificationList(data)
      checkedItems.value = checkedThreads.filter(checkedItem => (
        threadsRaw.some(thread => thread.id === checkedItem.id)
      ))
    }
    catch (error) {
      notifications.value = []
      failedLoadingNotifications.value = true
      checkedItems.value = []
    }

    loadingNotifications.value = false
    skeletonVisible.value = false

    const newNotifications = filterNewThreads(threadsRaw, threadsPreviousRaw)

    if (newNotifications.length > 0) {
      if (AppStorage.get('soundsEnabled'))
        invoke(InvokeCommand.PlayNotificationSound)

      if (AppStorage.get('showSystemNotifications')) {
        sendNotification({
          title: newNotifications[0].repository.full_name,
          body: newNotifications[0].subject.title,
        })
      }
    }
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

  watchEffect(() => {
    const hasUnread = notifications.value.some(n => isThread(n) && n.unread)
    invoke(InvokeCommand.SetIconTemplate, { isTemplate: !hasUnread })
  })

  function findThreadIndex(thread: Thread) {
    return notifications.value.findIndex(({ id }) => id === thread.id)
  }

  async function markCheckedNotificationsAsRead(accessToken: NonNullable<AppStorageContext['accessToken']>) {
    const deletedThreads: Thread['id'][] = []
    const checkedThreads = checkedItems.value
    const snapshot = notifications.value.slice(0)

    checkedThreads.forEach(item => removeNotificationById(item.id))
    triggerRef(notifications)

    checkedItems.value = []

    try {
      await notificationApiMutex.runExclusive(() => pAll(
        checkedThreads.map(thread => async () => {
          await markNotificationAsRead(thread.id, accessToken)
          deletedThreads.push(thread.id)
        }),
        {
          stopOnError: false,
          concurrency: 7,
        },
      ))
    }
    catch (error) {
      notifications.value = snapshot
      deletedThreads.forEach(id => removeNotificationById(id))
      triggerRef(notifications)
    }
  }

  async function unsubscribeCheckedNotifications(accessToken: NonNullable<AppStorageContext['accessToken']>) {
    const deletedThreads: Thread['id'][] = []
    const checkedThreads = checkedItems.value
    const snapshot = notifications.value.slice(0)

    checkedItems.value = []

    checkedThreads.forEach(item => removeNotificationById(item.id))
    triggerRef(notifications)

    try {
      await notificationApiMutex.runExclusive(() => pAll(
        checkedThreads.map(thread => async () => {
          await unsubscribeNotification(thread.id, accessToken)
          deletedThreads.push(thread.id)
        }),
        {
          stopOnError: false,
          concurrency: 7,
        },
      ))
    }
    catch (error) {
      notifications.value = snapshot
      deletedThreads.forEach(id => removeNotificationById(id))
      triggerRef(notifications)
    }
  }

  const newRelease = ref<Option<UpdateManifest>>(null)
  const installingUpate = ref(false)

  async function updateAndRestart() {
    if (newRelease.value == null)
      return

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

  return {
    newRelease,
    notifications,
    currentPage: readonly(currentPage),
    loadingNotifications,
    skeletonVisible,
    pageFrom,
    failedLoadingNotifications,
    currentPageState,
    checkedItems,
    installingUpate,
    updateAndRestart,
    unsubscribeCheckedNotifications,
    removeNotificationById,
    findThreadIndex,
    markCheckedNotificationsAsRead,
    setPage,
    fetchNotifications,
    logout,
  }
})
