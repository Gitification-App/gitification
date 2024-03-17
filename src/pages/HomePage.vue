<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { onScopeDispose, ref } from 'vue'
import { whenever } from '@vueuse/core'
import type { ItemRenderList } from 'vue-selectable-items'
import { useStore } from '../stores/store'
import NotificationItem from '../components/NotificationItem.vue'
import { type MinimalRepository, type Thread, markNotificationAsRead, unsubscribeNotification } from '../api/notifications'
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
import { vContextmenu } from '../directives/contextmenu'
import { useI18n } from '../composables/useI18n'
import { useRoute } from '../composables/useRoute'
import { useAppHooks } from '../composables/useAppHooks'

const store = useStore()
const route = useRoute()
const { t } = useI18n()
const { emitRefetch } = useAppHooks()

if (route.state.value.fetchOnEnter) {
  emitRefetch(true)
}

const { emitOpen, emitUnsubscribe, emitMarkAsRead } = useAppHooks()

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
  if (store.checkedItems.length === 0) {
    return
  }

  emitMarkAsRead(store.checkedItems[0])
})

useKey('o', () => {
  if (store.checkedItems.length === 0) {
    return
  }

  emitOpen(store.checkedItems[0])
})

useKey('u', () => {
  if (store.checkedItems.length === 0) {
    return
  }

  emitUnsubscribe(store.checkedItems[0])
})

function createContextmenuItems(item: Thread | MinimalRepository): ItemRenderList<ItemMeta> {
  const checked = store.isChecked(item)

  const checkText = isRepository(item) ? t.selectAll : t.select
  const uncheckText = isRepository(item) ? t.unselectAll : t.unselect

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
        meta: { text: t.markAllAsRead, icon: Icons.Check16, key: 'M' },
        onSelect() {
          emitMarkAsRead(item)
        },
      }),
      menuItem({
        key: 'open:all',
        meta: { text: t.openAll, icon: Icons.LinkExternal16, key: 'O' },
        onSelect() {
          emitOpen(item)
        },
      }),
      menuItem({
        key: 'unsubscribe:all',
        meta: { text: t.unsubscribeAll, icon: Icons.BellSlash16, key: 'U' },
        onSelect() {
          emitUnsubscribe(item)
        },
      }),
      checked && menuItem({
        key: 'clear',
        meta: { text: t.clearSelections, icon: Icons.Circle, key: 'ESC' },
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
      meta: { text: t.markAsRead, icon: Icons.Check16, key: 'M' },
      onSelect() {
        emitMarkAsRead(item)
      },
    }),

    menuItem({
      key: 'open',
      meta: { text: t.open, icon: Icons.LinkExternal16, key: 'O' },
      onSelect() {
        emitOpen(item)
      },
    }),

    menuItem({
      key: 'unsubscribe',
      meta: { text: t.unsubscribe, icon: Icons.BellSlash16, key: 'U' },
      onSelect() {
        emitUnsubscribe(item)
      },
    }),

    checked && menuItem({
      key: 'clear',
      meta: { text: t.clearSelections, icon: Icons.Circle, key: 'ESC' },
      onSelect: () => {
        store.checkedItems = []
      },
    }),
  ]
}

function handleClickRepo(repo: MinimalRepository) {
  open(`https://github.com/${repo.full_name}`)
}
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
      :description="t.oopsieCouldntLoad"
    >
      <template #footer>
        <AppButton @click="emitRefetch(true)">
          {{ t.refresh }}
        </AppButton>
      </template>
    </EmptyState>

    <EmptyState
      v-else-if="store.notifications.length === 0"
      :iconSize="EmptyStateIconSize.Big"
      :icon="Icons.Check"
      :description="t.itsAllClear"
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
      @click:notification="emitOpen"
      @click:repo="handleClickRepo"
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
