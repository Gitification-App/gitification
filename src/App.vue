<script setup lang="ts">
import { onMounted, watchEffect } from 'vue'
import AppScroller from './components/AppScroller.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { ColorPreference, FETCH_INTERVAL_DURATION, InvokeCommand } from './constants'
import LandingPage from './pages/LandingPage.vue'
import { useInterval } from './composables/useInterval'
import { AppStorage } from './storage'
import ContextMenu from './components/ContextMenu.vue'
import { useTheme } from './composables/useTheme'
import { Page, useRoute } from './composables/useRoute'
import { useContextMenu } from './composables/useContextMenu'
import { useCommonCalls } from './composables/useCommonCalls'

const { currentPage } = useRoute()
const contextmenu = useContextMenu()
const commonCalls = useCommonCalls()

useInterval(() => {
  if (AppStorage.get('accessToken') && AppStorage.get('user')) {
    commonCalls.fetchThreads(false)
  }
}, FETCH_INTERVAL_DURATION)

const { theme } = useTheme()

watchEffect(() => {
  if (theme.value === ColorPreference.Dark) {
    document.documentElement.classList.remove('light-theme')
  }
  else {
    document.documentElement.classList.add('light-theme')
  }
})
</script>

<template>
  <Teleport to="body">
    <div id="app-border" />
  </Teleport>

  <AppSidebar />

  <AppScroller>
    <HomePage v-if="currentPage === Page.Home" />
    <SettingsPage v-else-if="currentPage === Page.Settings" />
    <LandingPage v-else-if="currentPage === Page.Landing" />
  </AppScroller>

  <ContextMenu
    :state="contextmenu.state.value"
    @close="contextmenu.clear()"
  />
</template>
