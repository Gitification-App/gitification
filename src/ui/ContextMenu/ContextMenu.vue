<script lang="ts" setup>
import type { ItemRenderList } from 'vue-selectable-items'
import type { VirtualElement } from 'wowerlay'
import type { ItemMeta } from '../MenuItems/MenuItems.vue'
import { shallowRef } from 'vue'
import { useFloatingVisibility } from '../../composables/useFloatingEvent'
import { useTargetWrapper } from '../../composables/useTargetWrapper'
import * as UI from '../index'
import MenuItems, { menuItem } from '../MenuItems/MenuItems.vue'

type Props = {
  getItems: () => {
    text: string
    hotkey?: string
    action: () => void
    icon?: any
  }[]
}

const props = defineProps<Props>()
const { TargetWrapper } = useTargetWrapper()
const virtualTarget = shallowRef<VirtualElement | null>(null)
const items = shallowRef<ItemRenderList<ItemMeta>>([])
const visible = useFloatingVisibility()

function handleEvent(event: MouseEvent) {
  event.preventDefault()

  visible.value = true
  virtualTarget.value = {
    getBoundingClientRect: () => new DOMRect(event.clientX, event.clientY, 0, 0),
  }
  items.value = props.getItems().map((item) => menuItem({
    key: item.text,
    onSelect: item.action,
    meta: {
      key: item.hotkey,
      text: item.text,
      icon: item.icon,
    },
  }))
}

function handleHide() {
  visible.value = false
  virtualTarget.value = null
  items.value = []
}
</script>

<template>
  <TargetWrapper
    :class="{
      'attention-active': virtualTarget != null,
    }"
    @contextmenu="handleEvent"
  >
    <slot />
  </TargetWrapper>

  <UI.FloatingContent
    :target="virtualTarget"
    :visible="visible"
    position="right-start"
    @update:visible="handleHide"
  >
    <MenuItems
      :items="items"
      @select="handleHide"
    />
  </UI.FloatingContent>
</template>
