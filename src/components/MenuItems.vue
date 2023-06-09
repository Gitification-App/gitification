<script lang="ts">
import {
  type Context,
  type Item,
  type ItemRenderList, SelectableItems, createItemDefaults, filterSelectableItems, item,
} from 'vue-selectable-items'
import { onMounted } from 'vue'
import { useKey } from '../composables/useKey'
import { type Icons } from './Icons'
import { usePopoverContext } from './Popover.vue'

export interface ItemMeta {
  text: string
  icon?: typeof Icons[keyof typeof Icons]
  key?: string
  selected?: boolean
}

export const menuItem = item<ItemMeta>

const itemDefaults = createItemDefaults<ItemMeta>(({ disabled, meta }) => ({
  elementTag: 'button',
  elementAttrs: {
    tabindex: disabled ? -1 : 0,
    role: 'button',
    disabled: disabled || null,
    style: meta?.selected ? 'color: var(--accent-color); font-weight: bold;' : undefined,
  },
}))
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<{ items: ItemRenderList<ItemMeta> }>(), {
  items: () => [],
})

defineOptions({
  inheritAttrs: false,
})

function setupHandle(ctx: Context) {
  useKey('up,shift+tab', () => ctx.focusPrevious(), { input: true, repeat: true, prevent: true })
  useKey('down,tab', () => ctx.focusNext(), { input: true, repeat: true, prevent: true })

  useKey(
    'enter',
    () => ctx.selectFocusedItem(),
    { input: true },
  )

  ctx.onFocus((meta, item, el) => {
    el?.focus()
  })

  const popoverContext = usePopoverContext()

  ctx.onSelect((meta, item) => {
    popoverContext.visible.value = false
  })

  onMounted(() => {
    const items = filterSelectableItems(props.items)

    for (const item of items) {
      if (item.meta?.selected) {
        ctx.setFocusByKey(item.key)
        break
      }
    }
  })
}
</script>

<template>
  <SelectableItems
    :itemDefaults="itemDefaults"
    :setup="setupHandle"
    :items="items"
    noWrapperElement
  >
    <template #render="{ meta }: Item<ItemMeta>">
      <div
        v-if="meta!.icon"
        class="item-icon"
      >
        <component :is="meta!.icon" />
      </div>
      <div class="item-text">
        {{ meta!.text }}
      </div>
      <span
        v-if="meta?.key"
        class="item-key"
      >
        {{ meta.key }}
      </span>
    </template>
  </SelectableItems>
</template>

<style lang="scss">
.vue-selectable-items {
  &-item {
    white-space: nowrap;
    width: 100%;
    padding: 5px 10px;
    outline: none;
    height: 32px;
    border-radius: 4px; // 8px parent border radius - 4px parent padding
    color: var(--text-faded);

    &,
    .item-text,
    .item-icon {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
    }

    &-focused {
      background-color: var(--item-bg);
      color: var(--text);
    }

    &-disabled {
      color: var(--gray);
    }

    .item-text {
      font-size: 13px;
      vertical-align: middle;
      color: currentColor;
      width: 100%;
    }

    .item-icon {
      flex-shrink: 0;
      margin-right: 10px;
      font-size: 14px;
      color: currentColor;

      :deep(.icon) {
        max-width: 17px;
        max-height: 17px;
      }
    }

    .item-key {
      color: var(--gray-bright);
      font-size: 10px;
      margin-left: 10px;
    }
  }
}
</style>
