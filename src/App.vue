<script setup lang="ts">
import { onMounted, watchEffect } from 'vue'
import { open } from '@tauri-apps/api/shell'
import { invoke } from '@tauri-apps/api'
import { sendNotification } from '@tauri-apps/api/notification'
import AppScroller from './components/AppScroller.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { ColorPreference, FETCH_INTERVAL_DURATION, InvokeCommand } from './constants'
import { useStore } from './stores/store'
import LandingPage from './pages/LandingPage.vue'
import { useInterval } from './composables/useInterval'
import { AppStorage } from './storage'
import ContextMenu from './components/ContextMenu.vue'
import { useTheme } from './composables/useTheme'
import { Page, useRoute } from './composables/useRoute'
import { useContextMenu } from './composables/useContextMenu'
import { useAppHooks } from './composables/useAppHooks'
import { filterNewNotifications, isRepository, isThread, toNotificationList } from './utils/notification'
import { createGithubWebURL } from './utils/github'
import type { MinimalRepository, Thread } from './api/notifications'
import { getNotifications, markNotificationAsRead, unsubscribeNotification } from './api/notifications'

const store = useStore()
const { currentPage } = useRoute()
const contextmenu = useContextMenu()
const { onOpen, onUnsubscribe, onMarkAsRead, emitMarkAsRead, onRefetch, emitRefetch } = useAppHooks()

useInterval(() => {
  if (AppStorage.get('accessToken') && AppStorage.get('user')) {
    emitRefetch(false)
  }
}, FETCH_INTERVAL_DURATION)

const { theme } = useTheme()

watchEffect(() => {
  if (theme.value === ColorPreference.Dark) {
    document.documentElement.classList.remove('light-theme')
  }
  else {
    document.documentElement.classList.add('light-theme')
  }
})

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

onMarkAsRead((target) => {
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
})

onOpen((target) => {
  const threads = getThreadsToProcess(target)

  for (const thread of threads) {
    const url = createGithubWebURL({ notification: thread, userId: AppStorage.get('user')!.id })
    open(url)
  }

  if (AppStorage.get('markAsReadOnOpen')) {
    emitMarkAsRead(threads)
  }
})

onUnsubscribe((target) => {
  const threads = getThreadsToProcess(target)

  for (const thread of threads) {
    unsubscribeNotification(thread.id, AppStorage.get('accessToken')!)
  }

  emitMarkAsRead(threads)
})

onRefetch(async (withSkeletons) => {
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
})

const token = AppStorage.get('accessToken')
const user = AppStorage.get('user')

if (token && user) {
  emitRefetch(true)
}
</script>

<template>
  <Teleport to="body">
    <div id="app-border" />
  </Teleport>

  <AppSidebar />

  <AppScroller>
    <HomePage v-if="currentPage === Page.Home" />
    <SettingsPage v-else-if="currentPage === Page.Settings" />
    <LandingPage v-else-if="currentPage === Page.Landing" />
  </AppScroller>

  <ContextMenu
    :state="contextmenu.state.value"
    @close="contextmenu.clear()"
  />
</template>
