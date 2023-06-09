<script setup lang="ts">
import AppContent from './components/AppContent.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { FETCH_INTERVAL_DURATION, Page } from './constants'
import { useStore } from './stores/store'
import LandingPage from './pages/LandingPage.vue'
import { useInterval } from './composables/useInterval'
import { AppStorage } from './storage'

const store = useStore()

useInterval(() => {
  if (AppStorage.get('accessToken') && AppStorage.get('user'))
    store.fetchNotifications()
}, FETCH_INTERVAL_DURATION)
</script>

<template>
  <AppSidebar />

  <AppContent>
    <HomePage v-if="store.currentPage === Page.Home" />
    <SettingsPage v-else-if="store.currentPage === Page.Settings" />
    <LandingPage v-else-if="store.currentPage === Page.Landing" />
  </AppContent>
</template>
