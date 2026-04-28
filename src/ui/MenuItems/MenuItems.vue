<script lang="ts">
import type { EffectScope } from 'vue'
import type { Context, Item, ItemRenderList } from 'vue-selectable-items'
import { computed, effectScope, onMounted, onScopeDispose, watch } from 'vue'
import {
  createItemDefaults,
  filterSelectableItems,
  item,
  SelectableItems,
} from 'vue-selectable-items'
import { hideFloatingContent } from '../../composables/useFloatingEvent'
import { useKey } from '../../composables/useKey'
import * as UI from '../index'

export type ItemMeta = {
  text: string
  icon?: any
  key?: string
  selected?: boolean
}

export const menuItem = item<ItemMeta>
</script>

<script lang="ts" setup>
type Props = {
  items: ItemRenderList<ItemMeta>
  setup?: (ctx: Context) => void
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  setup: () => {},
})

const emits = defineEmits<{
  select: [meta: ItemMeta]
}>()

const itemDefaults = createItemDefaults<ItemMeta>(({ disabled }) => ({
  elementTag: 'button',
  elementAttrs: {
    tabindex: disabled ? -1 : 0,
    role: 'button',
    disabled: disabled || null,
    class: 'group outline-none',
  },
}))

const selectableItems = computed(() => filterSelectableItems(props.items))

function setupHandle(ctx: Context) {
  useKey('up,shift+tab', () => ctx.focusPrevious(), { input: true, repeat: true, prevent: true })
  useKey('down,tab', () => ctx.focusNext(), { input: true, repeat: true, prevent: true })

  ctx.onFocus((meta, item, el) => {
    el?.focus()
  })

  ctx.onSelect((meta, item) => {
    hideFloatingContent()
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

  watch(selectableItems, (items) => {
    scope?.stop()
    scope = effectScope(true)

    scope.run(() => {
      for (const item of items) {
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
        class="relative h-[40px] py-1 gap-2 flex flex-row items-center text-left justify-start w-full group-[.vue-selectable-items-item-focused]:bg-surface-3"
        :class="[
          tickShown ? 'px-5' : 'px-2',
        ]"
      >
        <UI.Icons.Tick01
          v-if="meta.selected"
          class="left-[4px] absolute top-0 bottom-0 my-auto text-[12px] text-txt-1"
        />

        <div
          v-if="iconShown"
          class="text-txt-2 shrink-0 size-[24px] grid place-items-center text-[16px]"
        >
          <component
            :is="meta.icon"
            v-if="meta.icon"
          />
        </div>

        <div class="mr-auto text-sm text-txt-1 shrink min-w-0 truncate">
          {{ meta.text }}
        </div>

        <UI.Key
          v-if="meta.key"
          :hotkey="meta.key"
        />
      </div>
    </template>
  </SelectableItems>
</template>
