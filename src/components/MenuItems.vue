<script lang="ts">
import type { EffectScope } from 'vue'
import type { Context, Item, ItemRenderList } from 'vue-selectable-items'
import { whenever } from '@vueuse/core'
import { computed, effectScope, onMounted, onScopeDispose } from 'vue'
import {
  createItemDefaults,
  filterSelectableItems,
  item,
  SelectableItems,
} from 'vue-selectable-items'
import { useKey } from '../composables/useKey'
import * as UI from '../ui'
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
    class: 'group outline-none',
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

const selectableItems = computed(() => filterSelectableItems(props.items))

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
    for (const item of selectableItems.value) {
      if (item.meta?.selected) {
        ctx.setFocusByKey(item.key)
        break
      }
    }
  })

  let scope: EffectScope | null = null

  onScopeDispose(() => {
    scope?.stop()
    scope = null
  })

  whenever(() => selectableItems.value.length > 0, (items) => {
    scope?.stop()
    scope = effectScope(true)

    scope.run(() => {
      for (const item of selectableItems.value) {
        if (item.meta?.key) {
          useKey(item.meta.key, () => {
            ctx.setFocusByKey(item.key)
            ctx.selectFocusedItem()
          }, { prevent: true, source: () => true })
        }
      }
    })
  }, { immediate: true, flush: 'post' })

  props.setup(ctx)
}

const iconShown = computed(() => {
  return selectableItems.value.some((item) => item.meta?.icon)
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
    <template #render="{ meta }: Item<ItemMeta> & Required<Pick<Item<ItemMeta>, 'meta'>>">
      <div
        class="h-[40px] pl-2 py-1 gap-2 flex flex-row items-center text-left justify-start w-full group-[.vue-selectable-items-item-focused]:bg-surface-5 group-hover:bg-surface-4"
        :class="{
          'pr-2': tickShown,
          'pr-3': !tickShown,
        }"
      >
        <div
          v-if="iconShown"
          class="text-txt-2 shrink-0 size-[32px] grid place-items-center text-[16px]"
        >
          <component
            :is="meta.icon"
            v-if="meta.icon"
          />
        </div>

        <div class="mr-auto text-sm text-txt-2 shrink min-w-0 truncate">
          {{ meta.text }}
        </div>

        <UI.Key
          v-if="meta.key"
          :hotkey="meta.key"
        />

        <span
          v-if="tickShown"
          class="shrink-0 text-[16px] grid place-items-center invisible text-txt-2"
          :class="{
            visible: meta.selected,
          }"
        >
          <UI.Icons.Tick01 />
        </span>
      </div>
    </template>
  </SelectableItems>
</template>
