<script lang="ts" setup>
import type { VirtualElement } from 'wowerlay'
import { shallowRef } from 'vue'
import { useKey } from '../../composables/useKey'
import * as UI from '../index'
import MenuItems, { menuItem } from '../MenuItems/MenuItems.vue'

type Props = {
  items: {
    text: string
    hotkey?: string
    action: () => void
  }[]
}

const props = defineProps<Props>()
const target = shallowRef<VirtualElement | null>(null)

function handleEvent(event: MouseEvent) {
  event.preventDefault()
  target.value = {
    getBoundingClientRect: () => new DOMRect(event.clientX, event.clientY, 0, 0),
  }
}

useKey('esc', () => {
  target.value = null
}, { source: () => target.value != null })
</script>

<template>
  <div
    class="contents!"
    @contextmenu="handleEvent"
  >
    <slot />
  </div>

  <UI.FloatingContent
    :target="target"
    :visible="target !== null"
    position="right-start"
    class="attention-overlay"
    @update:visible="(value) => {
      if (!value) {
        target = null
      }
    }"
  >
    <MenuItems
      :items="props.items.map(item => menuItem({
        key: item.text,
        onSelect: item.action,
        meta: {
          key: item.hotkey,
          text: item.text,
        },
      }))"
      @select="target = null"
    />
  </UI.FloatingContent>
</template>
