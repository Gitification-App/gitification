import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import type { ItemRenderList } from 'vue-selectable-items'
import type { ItemMeta } from '../components/MenuItems.vue'
import type { Option } from '../types'

export type ContextmenuState = {
  targetRectFn: () => DOMRect
  itemsFn: () => ItemRenderList<ItemMeta>
  currentTarget: HTMLElement | null
}

export const useContextmenu = defineStore('tooltip', () => {
  const state = shallowRef<Option<ContextmenuState>>(null)

  function clear() {
    state.value = null
  }

  return {
    state,
    clear,
  }
})
