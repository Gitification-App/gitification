<script lang="ts">
import type { Context, Item, ItemRenderList } from 'vue-selectable-items'
import { computed, onMounted } from 'vue'
import {

  createItemDefaults,
  filterSelectableItems,
  item,
  SelectableItems,
} from 'vue-selectable-items'
import { useKey } from '../composables/useKey'
import { UI } from '../ui'
import { usePopoverContext } from './Popover.vue'

export type ItemMeta = {
  text: string
  icon?: any
  key?: string
  selected?: boolean
}

export const menuItem = item<ItemMeta>

const itemDefaults = createItemDefaults<ItemMeta>(({ disabled }) => ({
  elementTag: 'button',
  elementAttrs: {
    tabindex: disabled ? -1 : 0,
    role: 'button',
    disabled: disabled || null,
    class: 'group',
  },
}))

type Props = {
  items: ItemRenderList<ItemMeta>
  setup?: (ctx: Context) => void
}
</script>

<script lang="ts" setup>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  setup: () => {},
})

const emits = defineEmits<{
  (e: 'select', meta: ItemMeta): void
}>()

function setupHandle(ctx: Context) {
  useKey('up,shift+tab', () => ctx.focusPrevious(), { input: true, repeat: true, prevent: true })
  useKey('down,tab', () => ctx.focusNext(), { input: true, repeat: true, prevent: true })

  ctx.onFocus((meta, item, el) => {
    el?.focus()
  })

  const popoverContext = usePopoverContext()

  ctx.onSelect((meta, item) => {
    if (popoverContext) {
      popoverContext.visible.value = false
    }
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

  props.setup(ctx)
}

const selectableItems = computed(() => filterSelectableItems(props.items))

const iconShown = computed(() => {
  return selectableItems.value.some((item) => item.meta?.icon)
})

const keyShown = computed(() => {
  return selectableItems.value.some((item) => item.meta?.key)
})

const tickShown = computed(() => {
  return selectableItems.value.some((item) => item.meta?.selected)
})
</script>

<template>
  <SelectableItems
    :itemDefaults="itemDefaults"
    :setup="setupHandle"
    :items="items"
    class="flex flex-col"
    @select="(meta: ItemMeta) => emits('select', meta)"
  >
    <template #render="{ meta }: Item<ItemMeta>">
      <div class="h-[40px] pl-2 pr-4 py-1 gap-1 flex flex-row items-center text-left justify-start w-full group-[.vue-selectable-items-item-focused]:bg-surface-4 group-hover:bg-surface-4">
        <div
          v-if="iconShown"
          class="text-txt-2 shrink-0 size-[32px] grid place-items-center text-[16px]"
        >
          <component
            :is="meta.icon"
            v-if="meta?.icon"
          />
        </div>

        <div class="text-sm text-txt-2 shrink w-full">
          {{ meta!.text }}
        </div>

        <span
          v-if="keyShown"
          class="text-xs w-[24px] text-txt-3"
        >
          {{ meta?.key }}
        </span>

        <span
          v-if="tickShown"
          class="shrink-0 text-[16px] grid place-items-center invisible text-txt-2"
          :class="{
            visible: meta?.selected,
          }"
        >
          <UI.Icons.Tick01 />
        </span>
      </div>
    </template>
  </SelectableItems>
</template>
