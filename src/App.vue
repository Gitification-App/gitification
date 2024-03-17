<script setup lang="ts">
import { watchEffect } from 'vue'
import { open } from '@tauri-apps/api/shell'
import AppScroller from './components/AppScroller.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { ColorPreference, FETCH_INTERVAL_DURATION } from './constants'
import { useStore } from './stores/store'
import LandingPage from './pages/LandingPage.vue'
import { useInterval } from './composables/useInterval'
import { AppStorage } from './storage'
import ContextMenu from './components/ContextMenu.vue'
import { useTheme } from './composables/useTheme'
import { Page, useRoute } from './composables/useRoute'
import { useContextMenu } from './composables/useContextMenu'
import { useAppHooks } from './composables/useAppHooks'
import { isRepository, isThread } from './utils/notification'
import { createGithubWebURL } from './utils/github'
import type { MinimalRepository, Thread } from './api/notifications'
import { markNotificationAsRead, unsubscribeNotification } from './api/notifications'

const store = useStore()
const { currentPage } = useRoute()
const contextmenu = useContextMenu()

useInterval(() => {
  if (AppStorage.get('accessToken') && AppStorage.get('user')) {
    store.fetchNotifications()
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

const { onOpen, onUnsubscribe, onMarkAsRead, emitMarkAsRead } = useAppHooks()

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
