<script setup lang="ts">
import { computed } from 'vue'
import * as UI from '..'
import { useKey } from '../../composables/useKey'
import { usePopoverControl } from '../../composables/usePopoverControl'
import * as Gitification from '../../gitification/index'
import { menuItem } from '../MenuItems/MenuItems.vue'

const settingsItems = computed(() => [
  menuItem({
    key: 'repository',
    meta: { text: 'Repository', icon: UI.Icons.Github01, key: '1' },
    onSelect() {
      Gitification.actions.openURL('https://github.com/Gitification-App/gitification')
    },
  }),
  menuItem({
    key: 'settings',
    meta: { text: 'Settings', icon: UI.Icons.Settings03, key: '2' },
    onSelect: () => Gitification.router.navigate('settings'),
  }),
  menuItem({
    key: 'logout',
    onSelect: Gitification.actions.logout,
    meta: {
      text: 'Logout',
      icon: UI.Icons.Logout05,
      key: '3',
    },
  }),
  menuItem({
    key: 'quit',
    onSelect: () => Gitification.actions.quitApp(),
    meta: {
      text: 'Quit App',
      icon: UI.Icons.Cancel01,
      key: '4',
    },
  }),
])

const profilePopoverControl = usePopoverControl()
const menuPopoverControl = usePopoverControl()

useKey('.', () => {
  menuPopoverControl.toggle()
})

useKey('p', () => {
  profilePopoverControl.toggle()
})

useKey('r', () => {
  Gitification.actions.fetchThreads(true)
})
</script>

<template>
  <div
    class="bg-surface-1 flex flex-col shrink-0 gap-1 p-4 w-[64px] h-full  border-r-2 border-surface-2"
  >
    <UI.Popover
      v-if="Gitification.state.currentUser != null"
      position="right-start"
      :control="profilePopoverControl"
    >
      <template #target>
        <UI.Tooltip
          position="right"
          title="Switch Account [p]"
        >
          <UI.Button
            variant="ghost"
            paddingVariant="icon"
            hotkey="p"
          >
            <img
              :draggable="false"
              :src="Gitification.state.currentUser.user.avatar_url"
              class="rounded-full size-[20px]"
              width="20"
              height="20"
              :title="Gitification.state.currentUser.user.url.split('/').slice(-1)[0]"
            >
          </UI.Button>
        </UI.Tooltip>
      </template>

      <template #default>
        <UI.PopoverContentAccountSwitch />
      </template>
    </UI.Popover>

    <UI.Tooltip
      position="right"
      title="Fetch Notifications [r]"
    >
      <UI.Button
        class="mt-auto"
        variant="ghost"
        paddingVariant="icon"
        title="Fetch Notifications"
        @click="Gitification.actions.fetchThreads(true)"
      >
        <UI.Icons.Reload
          :class="{
            'animate-spin': Gitification.state.threadLoadStatus === 'loading' || Gitification.state.threadLoadStatus === 'syncing',
          }"
        />
      </UI.Button>
    </UI.Tooltip>

    <UI.Popover
      position="right-end"
      :control="menuPopoverControl"
    >
      <template #target>
        <UI.Tooltip
          position="right"
          title="Menu [.]"
        >
          <UI.Button
            variant="ghost"
            paddingVariant="icon"
            hotkey="."
          >
            <UI.Icons.Menu02 />
          </UI.Button>
        </UI.Tooltip>
      </template>

      <UI.MenuItems :items="settingsItems" />
    </UI.Popover>
  </div>
</template>
