<script setup lang="ts">
import { watchEffect } from 'vue'
import AppScroller from './components/AppScroller.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { ColorPreference, FETCH_INTERVAL_DURATION } from './constants'
import { useStore } from './stores/store'
import LandingPage from './pages/LandingPage.vue'
import { useInterval } from './composables/useInterval'
import { AppStorage } from './storage'
import { Page, useRoute } from './composables/useRoute'

const store = useStore()
const route = useRoute()

useInterval(() => {
  if (AppStorage.get('accessToken') && AppStorage.get('user'))
    store.fetchNotifications()
}, FETCH_INTERVAL_DURATION)

watchEffect(() => {
  if (store.theme === ColorPreference.Dark)
    document.documentElement.classList.remove('light-theme')
  else
    document.documentElement.classList.add('light-theme')
})
</script>

<template>
  <Teleport to="body">
    <div id="app-border" />
  </Teleport>

  <AppSidebar />

  <AppScroller>
    <HomePage v-if="route.currentPage.value === Page.Home" />
    <SettingsPage v-else-if="route.currentPage.value === Page.Settings" />
    <LandingPage v-else-if="route.currentPage.value === Page.Landing" />
  </AppScroller>
</template>
