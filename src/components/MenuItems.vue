<script lang="ts">
import { type Context, Item, type ItemRenderList, SelectableItems, createItemDefaults, item } from 'vue-selectable-items'
import { useKey } from '../composables/useKey'
import { type Icons } from './Icons'
import { usePopoverContext } from './Popover.vue'

export interface ItemMeta {
  text: string
  icon: typeof Icons[keyof typeof Icons]
}

export const menuItem = item<ItemMeta>

const itemDefaults = createItemDefaults<ItemMeta>(({ disabled }) => ({
  elementTag: 'button',
  elementAttrs: {
    tabindex: disabled ? -1 : 0,
    role: 'button',
    disabled: disabled || null,
  },
}))
</script>

<script lang="ts" setup>
withDefaults(defineProps<{ items: ItemRenderList<ItemMeta> }>(), {
  items: () => [],
})

defineOptions({
  inheritAttrs: false,
})

const popoverContext = usePopoverContext()

const setupHandle = (ctx: Context) => {
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

  ctx.onSelect((meta, item) => {
    popoverContext.visible.value = false
  })
}
</script>

<template>
  <SelectableItems
    :item-defaults="itemDefaults"
    :setup="setupHandle"
    :items="items"
    no-wrapper-element
  >
    <template #render="{ meta }: Item<ItemMeta>">
      <div class="item-icon">
        <component
          :is="meta!.icon"
          class="no-stroke"
        />
      </div>
      <div class="item-text">
        {{ meta!.text }}
      </div>
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
    border-radius: 8px;
    color: var(--white-faded);

    &,
    .item-text,
    .item-icon {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
    }

    &-focused {
      background-color: var(--item-bg);
      color: var(--white);
    }

    .item-text {
      font-size: 13px;
      vertical-align: middle;
      color: currentColor;
    }

    .item-icon {
      margin-right: 10px;
      font-size: 14px;
      color: currentColor;
    }
  }
}
</style>
