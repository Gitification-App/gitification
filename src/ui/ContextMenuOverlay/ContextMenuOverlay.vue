<script setup lang="ts">
import type { VirtualElement } from 'wowerlay'
import { whenever } from '@vueuse/core'
import { computed, onWatcherCleanup } from 'vue'
import { useActiveContextMenu } from '../../composables/useContextMenuItems'
import FloatingContent from '../FloatingContent/FloatingContent.vue'
import { menuItem } from '../MenuItems/MenuItems.vue'

const activeMenu = useActiveContextMenu()

const menu = computed(() => {
  if (activeMenu.value == null) {
    return null
  }

  const { items, x, y } = activeMenu.value

  return {
    target: {
      getBoundingClientRect: () => new DOMRect(x, y, 0, 0),
    } as VirtualElement,
    items: items.map((item) => menuItem({
      key: item.text,
      onSelect: () => void item.action(),
      meta: {
        icon: item.icon,
        text: item.text,
        key: item.hotkey,
      },
    })),
  }
})

whenever(() => activeMenu.value?.target, (target) => {
  target.classList.add('active-attention')

  onWatcherCleanup(() => {
    target.classList.remove('active-attention')
  })
}, { flush: 'post' })
</script>

<template>
  <FloatingContent
    :target="menu?.target"
    :visible="menu != null"
    position="right-start"
    @update:visible="(value) => {
      if (!value) {
        activeMenu?.hide()
      }
    }"
  />
</template>
