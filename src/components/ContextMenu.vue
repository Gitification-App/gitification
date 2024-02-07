<script lang="ts">
import { Wowerlay } from 'wowerlay'
import { type Context, filterSelectableItems } from 'vue-selectable-items'
import { useKey } from '../composables/useKey'
import { handleTransition } from '../utils/wowerlay'
import type { ContextmenuState } from '../stores/contextmenu'
import type { Option } from '../types'
import MenuItems from './MenuItems.vue'
</script>

<script lang="ts" setup>
type Props = {
  state: Option<ContextmenuState>
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

useKey(
  'esc',
  () => emit('close'),
  { prevent: true, source: () => props.state != null },
)

function handleSetup(ctx: Context) {
  const items = filterSelectableItems(props.state!.itemsFn())

  for (const item of items) {
    const shortcut = item.meta!.key?.toLowerCase()

    if (shortcut && shortcut !== 'esc') {
      useKey(
        shortcut,
        () => {
          ctx.setFocusByKey(item.key)
          ctx.selectFocusedItem()
        },
        { prevent: true },
      )
    }
  }
}
</script>

<template>
  <Wowerlay
    :visible="props.state != null"
    class="contextmenu"
    tabindex="-1"
    :target="state && { getBoundingClientRect: state.targetRectFn } || null"
    :gap="2"
    :backgroundAttrs="{
      style: { zIndex: 1500 },
    }"
    position="bottom-start"
    :transition="handleTransition"
    @update:visible="emit('close')"
  >
    <MenuItems
      v-if="state"
      :items="state.itemsFn()"
      :setup="handleSetup"
      @select="emit('close')"
    />
  </Wowerlay>
</template>

<style lang="scss">
.contextmenu {
  outline: none;
  background-color: var(--popover-bg);
  min-width: 135px;
  border-radius: 8px;
  border: 1px solid var(--popover-border);
  backdrop-filter: blur(20px) saturate(180%) contrast(90%) brightness(50%);
  -webkit-backdrop-filter: blur(20px) saturate(180%) contrast(90%) brightness(50%);
  box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  padding: 4px;
}
</style>
