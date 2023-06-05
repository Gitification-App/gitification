<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { computed, onScopeDispose, ref } from 'vue'
import { type ReferenceElement } from 'wowerlay'
import { useStore } from '../stores/store'
import NotificationItem from '../components/NotificationItem.vue'
import { type MinimalRepository, type Thread, markNotificationAsRead } from '../api/notifications'
import { toGithubWebURL } from '../utils/github'
import { AppStorage } from '../storage'
import NotificationSkeleton from '../components/NotificationSkeleton.vue'
import type { Option } from '../types'
import { useElementNavigation } from '../composables/useElementNavigation'
import EmptyState, { EmptyStateIconSize } from '../components/EmptyState.vue'
import { Icons } from '../components/Icons'
import AppButton from '../components/AppButton.vue'
import { isRepository, isThread } from '../utils/notification'
import Popover from '../components/Popover.vue'
import MenuItems, { menuItem } from '../components/MenuItems.vue'
import { useKey } from '../composables/useKey'

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

function isChecked(item: MinimalRepository | Thread | null) {
  if (item == null)
    return false

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

useKey('esc', () => {
  store.checkedItems = []
}, { prevent: true })

const contextMenuThread = ref<Thread | null>(null)
const popoverTarget = ref<ReferenceElement | null>(null)
const popoverRef = ref<InstanceType<typeof Popover> | null>(null)

async function handleSelectMarkAsRead(triggeredByKeyboard = false) {
  if (triggeredByKeyboard) {
    if (store.checkedItems.length > 0) {
      store.markCheckedNotificationsAsRead(AppStorage.get('accessToken')!)
      store.checkedItems = []
      return
    }

    if (contextMenuThread.value) {
      const thread = contextMenuThread.value
      markNotificationAsRead(contextMenuThread.value.id, AppStorage.get('accessToken')!)
        .then(() => {
          store.removeNotificationById(thread.id)
        })

      return
    }
  }

  if (!contextMenuThread.value)
    return

  if (isChecked(contextMenuThread.value)) {
    store.markCheckedNotificationsAsRead(AppStorage.get('accessToken')!)
    store.checkedItems = []
    return
  }

  const thread = contextMenuThread.value
  markNotificationAsRead(thread.id, AppStorage.get('accessToken')!)
    .then(() => {
      store.removeNotificationById(thread.id)
    })
}

useKey('m', () => {
  handleSelectMarkAsRead(true)
  popoverRef.value?.hide()
})

function handleSelectOpen(triggeredByKeyboard = false) {
  if (triggeredByKeyboard) {
    if (store.checkedItems.length > 0) {
      store.checkedItems.forEach(handleNotificationClick)
      store.checkedItems = []
      return
    }

    if (contextMenuThread.value) {
      handleNotificationClick(contextMenuThread.value)
      return
    }
  }

  if (!contextMenuThread.value)
    return

  if (isChecked(contextMenuThread.value))
    store.checkedItems.forEach(handleNotificationClick)
  else
    handleNotificationClick(contextMenuThread.value)

  store.checkedItems = []
}

useKey('o', () => {
  handleSelectOpen(true)
  popoverRef.value?.hide()
})

const contextMenuItems = computed(() => [
  menuItem({
    key: 'read',
    meta: { text: 'Mark as read', icon: Icons.Check16, key: 'M' },
    onSelect: () => handleSelectMarkAsRead(),
  }),
  menuItem({
    key: 'open',
    meta: { text: 'Open', icon: Icons.LinkExternal16, key: 'O' },
    onSelect: () => handleSelectOpen(),
  }),
  // menuItem({
  //   key: 'unsubscribe',
  //   meta: { text: 'Unsubscribe', icon: Icons.BellSlash16, key: 'U' },
  //   disabled: true,
  // }),
  isChecked(contextMenuThread.value!) && menuItem({
    key: 'clear',
    meta: { text: 'Clear selections', icon: Icons.Circle, key: 'ESC' },
    onSelect: () => {
      store.checkedItems = []
    },
  }),
])

function handleThreadContextmenu(thread: Thread, event: MouseEvent) {
  if (!isChecked(thread))
    store.checkedItems = []

  contextMenuThread.value = thread
  popoverTarget.value = {
    getBoundingClientRect: () => ({
      top: event.clientY,
      left: event.clientX,
      width: 0,
      height: 0,
      bottom: event.clientY,
      right: event.clientX,
      x: event.clientX,
      y: event.clientY,
    }),
  }
  popoverRef.value?.show()
}
</script>

<template>
  <Popover
    ref="popoverRef"
    :target="popoverTarget"
    :wowerlayOptions="{ position: 'right-start' }"
  >
    <MenuItems :items="contextMenuItems" />
  </Popover>

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
        :checkboxVisible="store.checkedItems.length > 0"
        @contextmenu="handleThreadContextmenu"
        @click:notification="handleNotificationClick"
        @click:repo="handleRepoClick"
        @update:checked="(value) => handleUpdateChecked(item, value)"
      />
    </div>
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

    &-wrapper {
      display: flex;
      flex-flow: column nowrap;
      height: 100%;
      width: 100%;
    }
  }
</style>
