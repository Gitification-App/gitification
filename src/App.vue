<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import AppScroller from './components/AppScroller.vue'
import AppSidebar from './components/AppSidebar.vue'
import ContextMenu from './components/ContextMenu.vue'
import { useCommonCalls } from './composables/useCommonCalls'
import { useContextMenu } from './composables/useContextMenu'
import { useInterval } from './composables/useInterval'
import { useTheme } from './composables/useTheme'
import { ColorPreference, FETCH_INTERVAL_DURATION } from './constants'
import { Gitification } from './gitification'
import HomePage from './pages/HomePage.vue'
import LandingPage from './pages/LandingPage.vue'
import SettingsPage from './pages/SettingsPage.vue'

const contextmenu = useContextMenu()
const commonCalls = useCommonCalls()

useInterval(() => {
  if (Gitification.storage.get('accessToken') && Gitification.storage.get('user')) {
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

const Route = computed(() => {
  const current = Gitification.router.current.value

  if (current === 'home') {
    return HomePage
  }

  if (current === 'settings') {
    return SettingsPage
  }

  if (current === 'landing') {
    return LandingPage
  }

  throw new Error(`Unknown route: ${current}`)
})
</script>

<template>
  <Teleport to="body">
    <div id="app-border" />
  </Teleport>

  <AppSidebar />
  <AppScroller>
    <Route />
  </AppScroller>

  <ContextMenu
    :state="contextmenu.state.value"
    @close="contextmenu.clear()"
  />
</template>
