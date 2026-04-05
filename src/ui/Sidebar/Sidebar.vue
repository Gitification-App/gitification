<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { UI } from '..'
import MenuItems, { menuItem } from '../../components/MenuItems.vue'
import Popover from '../../components/Popover.vue'
import { vEl } from '../../directives/vEl'
import { Gitification } from '../../gitification'
import PopoverContentAccountSwitch from '../PopoverContentAccountSwitch/PopoverContentAccountSwitch.vue'

const currentUser = Gitification.storage.asRef('user')
const profileButton = shallowRef<HTMLElement | null>(null)
const settingsButton = shallowRef<HTMLElement | null>(null)

const settingsItems = computed(() => [
  menuItem({
    key: 'logout',
    onSelect: Gitification.actions.logout,
    meta: {
      text: 'Logout',
      icon: UI.Icons.Logout05,
    },
  }),
  menuItem({
    key: 'quit',
    onSelect: () => Gitification.router.navigate('settings'),
    meta: {
      text: 'Quit App',
      icon: UI.Icons.Cancel01,
    },
  }),
])
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

    <Popover
      :target="profileButton"
      :wowerlay-options="{ position: 'right-start' }"
    >
      <PopoverContentAccountSwitch />
    </Popover>

    <UI.Button
      class="mt-auto"
      variant="ghost"
      paddingVariant="icon"
      title="Reload"
    >
      <UI.Icons.Reload />
    </UI.Button>

    <UI.Button
      v-el="(el) => settingsButton = el"
      variant="ghost"
      paddingVariant="icon"
      title="Menu"
    >
      <UI.Icons.Settings03 />
    </UI.Button>

    <Popover
      :target="settingsButton"
      :wowerlay-options="{ position: 'right-end' }"
    >
      <MenuItems :items="settingsItems" />
    </Popover>
  </div>
</template>
