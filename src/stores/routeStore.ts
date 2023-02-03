import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'

import { Page } from '../constants'

export const useRouteStore = defineStore('routeStore', () => {
  const currentPage = ref(Page.Landing)

  return {
    currentPage,
  }
})
