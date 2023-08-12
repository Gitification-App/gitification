import { readonly, ref, shallowRef } from 'vue'
import { computedEager, createSharedComposable } from '@vueuse/core'
import { type Option } from '../types'

export enum Page {
  Settings = 'Settings',
  Home = 'Home',
  Landing = 'Landing',
}

export interface PageState {
  fetchOnEnter?: boolean
}

export interface PageMeta {
  withPadding?: boolean
}

const metaMap = {
  [Page.Settings]: {},
  [Page.Home]: { withPadding: true },
  [Page.Landing]: {},
}

export const useRoute = createSharedComposable(() => {
  const currentPage = ref(Page.Landing)
  const pageFrom = ref<Option<Page>>(null)
  const state = shallowRef<PageState>({})

  function go(page: Page, pageState: PageState = {}) {
    if (page === currentPage.value)
      return

    pageFrom.value = currentPage.value
    currentPage.value = page
    state.value = pageState
  }

  const meta = computedEager<PageMeta>(() => metaMap[currentPage.value])

  return {
    go,
    currentPage: readonly(currentPage),
    pageFrom: readonly(pageFrom),
    state: readonly(state),
    meta,
  }
})
