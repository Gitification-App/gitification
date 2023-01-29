import { readonly, ref } from 'vue'
import { defineStore } from 'pinia'

import { Page } from '../constants'

export const useRouteStore = defineStore('routeStore', () => {
  const currentPage = ref(Page.Home)

  function goToHome() {
    currentPage.value = Page.Home
  }

  function goToSettings() {
    currentPage.value = Page.Settings
  }

  return {
    currentPage: readonly(currentPage),
    goToHome,
    goToSettings,
  }
})
