import { readonly, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { type Option } from '../types'

export enum Page {
  Settings = 'Settings',
  Home = 'Home',
  Landing = 'Landing',
}

export interface PageState {
  fetchOnEnter?: boolean
}

export const useRoute = defineStore('route', () => {
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

  return {
    go,
    currentPage: readonly(currentPage),
    pageFrom: readonly(pageFrom),
    state: readonly(state),
  }
})
