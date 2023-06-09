<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { h, onScopeDispose, ref } from 'vue'
import { useStore } from '../stores/store'
import NotificationItem from '../components/NotificationItem.vue'
import type { MinimalRepository, Thread } from '../api/notifications'
import { toGithubWebURL } from '../utils/github'
import { AppStorage } from '../storage'
import NotificationSkeleton from '../components/NotificationSkeleton.vue'
import type { Option } from '../types'
import { useElementNavigation } from '../composables/useElementNavigation'
import EmptyState, { EmptyStateIconSize } from '../components/EmptyState.vue'
import { Icons } from '../components/Icons'
import AppButton from '../components/AppButton.vue'
import { isRepository, isThread } from '../utils/notification'
import type { IBottomBarItem } from '../components/BottomBar.vue'
import BottomBar from '../components/BottomBar.vue'

const store = useStore()

if (store.currentPageState.fetchOnEnter)
  store.fetchNotifications(true)

function handleNotificationClick(notification: Thread) {
  const url = toGithubWebURL({ notification, userId: AppStorage.get('user')!.id })
  open(url)
}

function handleRepoClick(repoFullName: string) {
  open(`https://github.com/${repoFullName}`)
}

const home = ref<Option<HTMLElement>>(null)

useElementNavigation({
  target: home,
  navigateNextHotkey: 'down, command+down, ctrl+down',
  navigatePreviousHotkey: 'up, command+up, ctrl+up',
  targetQuery: '.notification-item, .notification-title',
})

function isChecked(item: MinimalRepository | Thread) {
  if (isRepository(item)) {
    return store.notifications
      .filter(isThread)
      .filter(thread => thread.unread && thread.repository.id === item.id)
      .every(thread => (
        store.checkedItems.some(checkedItem => checkedItem.id === thread.id)
      ))
  }

  return store.checkedItems
    .some(checkedItem => checkedItem.id === item.id)
}

function handleUpdateChecked(item: MinimalRepository | Thread, value: boolean) {
  const checked = isChecked(item)

  if (value === checked)
    return

  if (value) {
    if (isRepository(item)) {
      for (const notificationItem of store.notifications) {
        if (isThread(notificationItem) && notificationItem.repository.full_name === item.full_name)
          store.checkedItems.push(notificationItem)
      }
      return
    }

    store.checkedItems.push(item)
    return
  }

  if (isRepository(item)) {
    store.checkedItems = store.checkedItems.filter(checkedItem => (
      checkedItem.repository.id !== item.id
    ))
    return
  }

  const index = store.checkedItems.findIndex(checkedItem => checkedItem.id === item.id)
  store.checkedItems.splice(index, 1)
}

function isCheckable(item: MinimalRepository | Thread) {
  if (isThread(item))
    return item.unread

  return store.notifications
    .filter(isThread)
    .filter(thread => thread.repository.id === item.id)
    .some(thread => thread.unread)
}

onScopeDispose(() => {
  store.checkedItems.length = 0
})

const bottomBarItems: IBottomBarItem[] = [
  {
    hotkey: 'esc',
    onSelect: () => store.checkedItems = [],
    text: 'Cancel',
    withCommand: false,
  },
  {
    hotkey: 'R',
    onSelect: () => store.markCheckedNotificationsAsRead(AppStorage.get('accessToken')!),
    text: 'Read',
    withCommand: false,
  },
  // {
  //   hotkey: 'M',
  //   onSelect: () => /* TODO */ null,
  //   text: 'Mute',
  // },
  {
    hotkey: 'O',
    onSelect: () => {
      store.checkedItems.forEach(handleNotificationClick)
      store.checkedItems = []
    },
    text: 'Open',
    withCommand: false,
  },
]
</script>

<template>
  <div class="home-wrapper">
    <div
      ref="home"
      class="home"
    >
      <NotificationSkeleton v-if="store.skeletonVisible" />

      <EmptyState
        v-else-if="store.failedLoadingNotifications"
        :iconSize="EmptyStateIconSize.Big"
        :icon="Icons.X"
        description="Oopsie! Couldn't load notifications."
      >
        <template #footer>
          <AppButton @click="store.fetchNotifications()">
            Refresh
          </AppButton>
        </template>
      </EmptyState>

      <EmptyState
        v-else-if="store.notifications.length === 0"
        :iconSize="EmptyStateIconSize.Big"
        :icon="Icons.Check"
        description="It's all clear sir!"
      />

      <NotificationItem
        v-for="item of store.notifications"
        :key="item.id"
        :value="item"
        :checked="isChecked(item)"
        :checkable="isCheckable(item)"
        @click:notification="handleNotificationClick"
        @click:repo="handleRepoClick"
        @update:checked="(value) => handleUpdateChecked(item, value)"
      />
    </div>

    <Suspense>
      <BottomBar
        v-if="store.checkedItems.length > 0"
        :selectedCount="store.checkedItems.length"
        :items="bottomBarItems"
      />
    </Suspense>
  </div>
</template>

<style lang="scss" scoped>
  .home {
    padding: 10px;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    scroll-padding-top: 10px;
    scroll-padding-bottom: 10px;
    position: relative;

    .bottom-bar {
      min-height: 0;
      flex-shrink: 1;
    }

    &-wrapper {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      width: 100%;
    }
  }
</style>
