import { shallowRef } from 'vue'
import type { ItemRenderList } from 'vue-selectable-items'
import type { ItemMeta } from '../components/MenuItems.vue'
import type { Option } from '../types'
import { singleton } from '../utils/common'

export type ContextMenuState = {
  targetRectFn: () => DOMRect
  itemsFn: () => ItemRenderList<ItemMeta>
  currentTarget: HTMLElement | null
}

export const useContextMenu = singleton(() => {
  const state = shallowRef<Option<ContextMenuState>>(null)

  function clear() {
    state.value = null
  }

  return {
    state,
    clear,
  }
})
