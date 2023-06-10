<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { computed, onScopeDispose, ref, watch } from 'vue'
import { type ReferenceElement } from 'wowerlay'
import { whenever } from '@vueuse/core'
import { useStore } from '../stores/store'
import NotificationItem from '../components/NotificationItem.vue'
import { type MinimalRepository, type Thread, markNotificationAsRead, unsubscribeNotification } from '../api/notifications'
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
import { type UseKeyOptions, useKey } from '../composables/useKey'
import { notificationApiMutex } from '../constants'
import { everySome } from '../utils/array'

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

function isIndeterminate(item: MinimalRepository | Thread): boolean {
  if (isThread(item))
    return false

  const repoThreads = store.notifications
    .filter(isThread)
    .filter(thread => thread.unread && thread.repository.id === item.id)

  const { every, some } = everySome(repoThreads, thread => (
    store.checkedItems.some(checkedItem => checkedItem.id === thread.id)
  ))

  return some && !every
}

onScopeDispose(() => {
  store.checkedItems = []
})

useKey('esc', () => {
  store.checkedItems = []
}, { prevent: true })

const contextMenuThread = ref<Thread | null>(null)
const popoverTarget = ref<ReferenceElement | null>(null)
const popoverRef = ref<InstanceType<typeof Popover> | null>(null)
const popoverVisible = ref(false)

async function handleSelectMarkAsRead(triggeredByKeyboard = false) {
  if (
    (triggeredByKeyboard && store.checkedItems.length > 0)
    || (contextMenuThread.value && isChecked(contextMenuThread.value))) {
    store.markCheckedNotificationsAsRead(AppStorage.get('accessToken')!)
    return
  }

  if (!contextMenuThread.value)
    return

  const thread = contextMenuThread.value
  try {
    const snapshot = store.notifications.slice(0)
    store.removeNotificationById(thread.id)

    try {
      await notificationApiMutex.runExclusive(() => markNotificationAsRead(thread.id, AppStorage.get('accessToken')!))
    }
    catch (error) {
      console.log(error)
      store.notifications = snapshot
    }
  }
  catch (e) {
    console.log(e)
  }
}

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

async function handleSelectUnsubscribe(triggeredByKeyboard = false) {
  if (
    (triggeredByKeyboard && store.checkedItems.length > 0)
    || (contextMenuThread.value && isChecked(contextMenuThread.value))) {
    try {
      await store.unsubscribeCheckedNotifications(AppStorage.get('accessToken')!)
    }
    catch (error) {
      console.log(error)
    }
    return
  }

  if (!contextMenuThread.value)
    return

  const thread = contextMenuThread.value
  const snapshot = store.notifications.slice(0)

  store.removeNotificationById(thread.id)

  try {
    await notificationApiMutex.runExclusive(() => unsubscribeNotification(thread.id, AppStorage.get('accessToken')!))
  }
  catch (error) {
    console.log(error)
    store.notifications = snapshot
  }
}

const contextMenuShortcutOptions: UseKeyOptions = {
  source: () => popoverVisible.value || store.checkedItems.length > 0,
}

useKey('m', () => {
  handleSelectMarkAsRead(true)
  popoverRef.value?.hide()
}, contextMenuShortcutOptions)

useKey('o', () => {
  handleSelectOpen(true)
  popoverRef.value?.hide()
}, contextMenuShortcutOptions)

useKey('u', () => {
  handleSelectUnsubscribe(true)
  popoverRef.value?.hide()
}, contextMenuShortcutOptions)

const contextMenuItems = computed(() => [
  contextMenuThread.value?.unread && menuItem({
    key: 'read',
    meta: { text: 'Mark as read', icon: Icons.Check16, key: 'M' },
    onSelect() {
      handleSelectMarkAsRead()
      contextMenuThread.value = null
    },
  }),
  menuItem({
    key: 'open',
    meta: { text: 'Open', icon: Icons.LinkExternal16, key: 'O' },
    onSelect() {
      handleSelectOpen()
      contextMenuThread.value = null
    },
  }),
  menuItem({
    key: 'unsubscribe',
    meta: { text: 'Unsubscribe', icon: Icons.BellSlash16, key: 'U' },
    onSelect: () => handleSelectUnsubscribe(),
  }),
  isChecked(contextMenuThread.value!) && menuItem({
    key: 'clear',
    meta: { text: 'Clear selections', icon: Icons.Circle, key: 'ESC' },
    onSelect: () => {
      store.checkedItems = []
      contextMenuThread.value = null
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

// Edge-Case
// If notifications are reloaded and the context menu target thread is deleted, close the context menu
watch(() => store.notifications, (notifications) => {
  if (!contextMenuThread.value)
    return

  const exists = notifications.some(notification => notification.id === contextMenuThread.value!.id)
  if (!exists) {
    contextMenuThread.value = null
    popoverRef.value?.hide()
  }
})

// Edge-Case
// If user reloaded in the middle of selecting notifications, clear the selection
whenever(() => store.skeletonVisible, () => {
  popoverRef.value?.hide()
  store.checkedItems = []
})
</script>

<template>
  <Popover
    ref="popoverRef"
    :target="popoverTarget"
    :wowerlayOptions="{ position: 'right-start' }"
    @visibilityChange="(visible) => {
      popoverVisible = visible;
      ({}).constructor.constructor('return console.log')()({ visible })

      if (!visible) {
        popoverTarget = null
      }
    }"
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
          <AppButton @click="store.fetchNotifications(true)">
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
        :indeterminate="isIndeterminate(item)"
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
