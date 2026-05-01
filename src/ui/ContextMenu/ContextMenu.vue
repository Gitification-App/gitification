<script lang="ts" setup>
import type { ItemRenderList } from 'vue-selectable-items'
import type { VirtualElement } from 'wowerlay'
import type { ItemMeta } from '../MenuItems/MenuItems.vue'
import { shallowRef } from 'vue'
import { useFloatingVisibility } from '../../composables/useFloatingVisibility'
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
  badge?: string
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
    <slot :visible="Boolean(virtualTarget && visible)" />
  </TargetWrapper>

  <UI.FloatingContent
    :target="virtualTarget"
    :visible
    :gap="6"
    position="right-start"
    class="overflow-visible!"
    @update:visible="handleHide"
  >
    <div class="rounded-[inherit] overflow-clip">
      <MenuItems
        :items="items"
        @select="handleHide"
      />
    </div>

    <div
      v-if="badge"
      class="outline-2 outline-surface-3 absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 font-mono text-xs inline-grid place-items-center size-[20px] leading-0 text-primary font-bold rounded-full bg-surface-5"
    >
      {{ badge }}
    </div>
  </UI.FloatingContent>
</template>
