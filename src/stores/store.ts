import { sendNotification } from '@tauri-apps/api/notification'
import { invoke } from '@tauri-apps/api/tauri'
import { defineStore } from 'pinia'
import { readonly, ref, shallowRef, watch } from 'vue'
import type { MinimalRepository, Thread } from '../api/notifications'
import { getNotifications } from '../api/notifications'
import type { Release } from '../api/releases'
import { InvokeCommand, Page } from '../constants'
import { AppStorage } from '../storage'
import type { Option, PageState } from '../types'
import { filterNewThreads, toNotificationList } from '../utils/notification'

export const useStore = defineStore('store', () => {
  const notifications = shallowRef<(Thread | MinimalRepository)[]>([])
  const loadingNotifications = ref(false)
  const failedLoadingNotifications = ref(false)
  const skeletonVisible = ref(false)

  let threadsRaw: Thread[] = []
  let threadsPreviousRaw: Thread[] = []

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
      const { data } = await getNotifications({
        accessToken,
        showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
        showReadNotifications: AppStorage.get('showReadNotifications'),
      })

      threadsPreviousRaw = threadsRaw
      threadsRaw = data

      notifications.value = toNotificationList(data)
    }
    catch (error) {
      notifications.value = []
      failedLoadingNotifications.value = true
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

  watch(notifications, () => {
    const hasUnread = threadsRaw.some(n => n.unread)
    invoke(InvokeCommand.SetIconTemplate, { isTemplate: !hasUnread })
  }, { deep: true, immediate: true })

  const newRelease = ref<Option<Release>>(null)

  return {
    newRelease,
    notifications,
    currentPage: readonly(currentPage),
    loadingNotifications,
    skeletonVisible,
    pageFrom,
    failedLoadingNotifications,
    currentPageState,
    setPage,
    fetchNotifications,
    logout,
  }
})
