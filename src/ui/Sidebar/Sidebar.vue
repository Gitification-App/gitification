<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { UI } from '..'
import MenuItems, { menuItem } from '../../components/MenuItems.vue'
import Popover from '../../components/Popover.vue'
import { useKey } from '../../composables/useKey'
import { usePopoverControl } from '../../composables/usePopoverControl'
import { vEl } from '../../directives/vEl'
import { Gitification } from '../../gitification'
import PopoverContentAccountSwitch from '../PopoverContentAccountSwitch/PopoverContentAccountSwitch.vue'

const currentUser = Gitification.storage.asRef('user')
const profileButton = shallowRef<HTMLElement | null>(null)
const menuButton = shallowRef<HTMLElement | null>(null)

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
    onSelect: () => Gitification.router.navigate('settings'),
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
</script>

<template>
  <div
    class="flex flex-col shrink-0 gap-1 p-4 w-[64px] h-full border-r border-surface-2"
  >
    <UI.Button
      v-if="currentUser != null"
      v-el="(el) => profileButton = el"
      variant="ghost"
      paddingVariant="icon"
      hotkey="p"
    >
      <img
        :draggable="false"
        :src="currentUser.avatar_url"
        class="rounded-full size-[20px]"
        width="20"
        height="20"
        :title="currentUser.url.split('/').slice(-1)[0]"
      >
    </UI.Button>

    <UI.Button
      class="mt-auto"
      variant="ghost"
      paddingVariant="icon"
      title="Reload"
    >
      <UI.Icons.Reload />
    </UI.Button>

    <UI.Button
      v-el="(el) => menuButton = el"
      variant="ghost"
      paddingVariant="icon"
      title="Menu"
      hotkey="."
    >
      <UI.Icons.Menu02 />
    </UI.Button>

    <Popover
      :target="profileButton"
      :wowerlay-options="{ position: 'right-start' }"
      :control="profilePopoverControl"
    >
      <PopoverContentAccountSwitch />
    </Popover>

    <Popover
      :target="menuButton"
      :wowerlay-options="{ position: 'right-end' }"
      :control="menuPopoverControl"
    >
      <MenuItems :items="settingsItems" />
    </Popover>
  </div>
</template>
