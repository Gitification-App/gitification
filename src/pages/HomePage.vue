<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { onScopeDispose, ref } from 'vue'
import { whenever } from '@vueuse/core'
import { type ItemRenderList } from 'vue-selectable-items'
import { useStore } from '../stores/store'
import NotificationItem from '../components/NotificationItem.vue'
import { type MinimalRepository, type Thread, markNotificationAsRead, unsubscribeNotification } from '../api/notifications'
import { toGithubWebURL } from '../utils/github'
import { AppStorage } from '../storage'
import NotificationSkeleton from '../components/NotificationSkeleton.vue'
import { useElementNavigation } from '../composables/useElementNavigation'
import EmptyState, { EmptyStateIconSize } from '../components/EmptyState.vue'
import { Icons } from '../components/Icons'
import AppButton from '../components/AppButton.vue'
import { isRepository } from '../utils/notification'
import { type ItemMeta, menuItem } from '../components/MenuItems.vue'
import { useKey } from '../composables/useKey'
import { CheckedNotificationProcess } from '../constants'
import { useRoute } from '../stores/route'
import { vContextmenu } from '../directives/contextmenu'

const store = useStore()
const route = useRoute()

if (route.state.fetchOnEnter)
  store.fetchNotifications(true)

function handleOpenNotification(thread: Thread) {
  const url = toGithubWebURL({ notification: thread, userId: AppStorage.get('user')!.id })
  open(url)
}

function handleClickNotification(thread: Thread) {
  handleOpenNotification(thread)

  if (AppStorage.get('markAsReadOnOpen')) {
    store.setChecked(thread, false)
    store.runWithSnapshot(async () => {
      if (!AppStorage.get('showReadNotifications'))
        store.removeNotificationById(thread.id)
      else
        store.mutateNotifications(() => thread.unread = false)

      await markNotificationAsRead(thread.id, AppStorage.get('accessToken')!)
    })
  }
}

function handleRepoClick(repoFullName: string) {
  open(`https://github.com/${repoFullName}`)
}

const home = ref<HTMLElement | null>(null)
useElementNavigation({
  target: home,
  navigateNextHotkey: 'down, command+down, ctrl+down',
  navigatePreviousHotkey: 'up, command+up, ctrl+up',
  targetQuery: '.notification-item, .notification-title',
})

onScopeDispose(() => {
  store.checkedItems = []
})

useKey('esc', () => {
  store.checkedItems = []
}, { prevent: true })

useKey('m', () => {
  if (store.checkedItems.length === 0)
    return

  handleSelectMarkAsRead(store.checkedItems[0])
})

useKey('o', () => {
  if (store.checkedItems.length === 0)
    return

  handleSelectOpen(store.checkedItems[0])
})

useKey('u', () => {
  if (store.checkedItems.length === 0)
    return

  handleSelectUnsubscribe(store.checkedItems[0])
})

async function handleSelectMarkAsRead(thread: Thread) {
  if (!thread.unread)
    return

  if (store.isChecked(thread)) {
    store.processCheckedNotifications(CheckedNotificationProcess.MarkAsRead)
    return
  }

  store.checkedItems = []

  store.runWithSnapshot(async () => {
    if (!AppStorage.get('showReadNotifications'))
      store.removeNotificationById(thread.id)
    else
      store.mutateNotifications(() => thread.unread = false)

    await markNotificationAsRead(thread.id, AppStorage.get('accessToken')!)
  })
}

function handleSelectOpen(thread: Thread) {
  if (!thread.unread) {
    handleOpenNotification(thread)
    return
  }

  if (store.isChecked(thread)) {
    store.checkedItems.forEach(handleOpenNotification)
  }
  else {
    store.checkedItems = []
    handleOpenNotification(thread)
  }

  if (AppStorage.get('markAsReadOnOpen'))
    handleSelectMarkAsRead(thread)
}

async function handleSelectUnsubscribe(thread: Thread) {
  if (store.isChecked(thread)) {
    store.processCheckedNotifications(CheckedNotificationProcess.Unsubscribe)
    return
  }

  store.checkedItems = []

  store.runWithSnapshot(async () => {
    if (thread.unread && !AppStorage.get('showReadNotifications'))
      store.removeNotificationById(thread.id)
    else
      store.mutateNotifications(() => thread.unread = false)

    await unsubscribeNotification(thread.id, AppStorage.get('accessToken')!)
  })
}

function handleSelectOpenAll(repository: MinimalRepository) {
  if (store.isCheckable(repository)) {
    store.setChecked(repository, true)
    handleSelectOpen(store.checkedItems[0])
  }
  else {
    const threads = store.getThreadsOfRepository(repository)
    threads.forEach(handleOpenNotification)
  }
}

function handleMarkAllAsRead(repository: MinimalRepository) {
  store.setChecked(repository, true)
  handleSelectMarkAsRead(store.checkedItems[0])
}

function handleUnsubscribeAll(repository: MinimalRepository) {
  if (store.isCheckable(repository)) {
    store.setChecked(repository, true)
    handleSelectUnsubscribe(store.checkedItems[0])
    return
  }

  const threads = store.getThreadsOfRepository(repository)
  threads.forEach(handleSelectUnsubscribe)
}

function createContextmenuItems(item: Thread | MinimalRepository): ItemRenderList<ItemMeta> {
  const checked = store.isChecked(item)

  const checkText = isRepository(item) ? 'Select all' : 'Select'
  const uncheckText = isRepository(item) ? 'Unselect all' : 'Unselect'

  const checkMeta = {
    text: checked ? uncheckText : checkText,
    icon: checked ? Icons.Dash16 : Icons.Plus16,
    key: 'S',
  }

  if (isRepository(item)) {
    return [
      store.isCheckable(item) && menuItem({
        key: 'select:repository',
        meta: checkMeta,
        onSelect() {
          store.setChecked(item, !checked)
        },
      }),
      store.isCheckable(item) && menuItem({
        key: 'mark:all',
        meta: { text: 'Mark all as read', icon: Icons.Check16, key: 'M' },
        onSelect() {
          handleMarkAllAsRead(item)
        },
      }),
      menuItem({
        key: 'open:all',
        meta: { text: 'Open all', icon: Icons.LinkExternal16, key: 'O' },
        onSelect() {
          handleSelectOpenAll(item)
        },
      }),
      menuItem({
        key: 'unsubscribe:all',
        meta: { text: 'Unsubscribe all', icon: Icons.BellSlash16, key: 'U' },
        onSelect() {
          handleUnsubscribeAll(item)
        },
      }),
      checked && menuItem({
        key: 'clear',
        meta: { text: 'Clear selections', icon: Icons.Circle, key: 'ESC' },
        onSelect: () => {
          store.checkedItems = []
        },
      }),
    ]
  }

  return [
    store.isCheckable(item) && menuItem({
      key: 'check:thread',
      meta: checkMeta,
      onSelect() {
        store.setChecked(item, !checked)
      },
    }),

    item.unread && menuItem({
      key: 'read',
      meta: { text: 'Mark as read', icon: Icons.Check16, key: 'M' },
      onSelect() {
        handleSelectMarkAsRead(item)
      },
    }),

    menuItem({
      key: 'open',
      meta: { text: 'Open', icon: Icons.LinkExternal16, key: 'O' },
      onSelect() {
        handleSelectOpen(item)
      },
    }),

    menuItem({
      key: 'unsubscribe',
      meta: { text: 'Unsubscribe', icon: Icons.BellSlash16, key: 'U' },
      onSelect() {
        handleSelectUnsubscribe(item)
      },
    }),

    checked && menuItem({
      key: 'clear',
      meta: { text: 'Clear selections', icon: Icons.Circle, key: 'ESC' },
      onSelect: () => {
        store.checkedItems = []
      },
    }),
  ]
}

// Edge-Case
// If user reloaded in the middle of selecting notifications, clear the selection
whenever(() => store.skeletonVisible, () => {
  store.checkedItems = []
})
</script>

<template>
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
      v-contextmenu="() => createContextmenuItems(item)"
      :value="item"
      :checked="store.isChecked(item)"
      :checkable="store.isCheckable(item)"
      :indeterminate="store.isIndeterminate(item)"
      :checkboxVisible="store.checkedItems.length > 0"
      @click:notification="handleClickNotification"
      @click:repo="handleRepoClick"
      @update:checked="(value) => store.setChecked(item, value)"
    />
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding: 10px;
  min-height: 100%;
  display: flex;
  flex-flow: column nowrap;

  .empty-state {
    margin: auto;
  }
}
</style>
