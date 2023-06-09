<script setup lang="ts">
import { watchEffect } from 'vue'
import AppContent from './components/AppContent.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { ColorPreference, FETCH_INTERVAL_DURATION, Page, prefersDark } from './constants'
import { useStore } from './stores/store'
import LandingPage from './pages/LandingPage.vue'
import { useInterval } from './composables/useInterval'
import { AppStorage } from './storage'

const store = useStore()

useInterval(() => {
  if (AppStorage.get('accessToken') && AppStorage.get('user'))
    store.fetchNotifications()
}, FETCH_INTERVAL_DURATION)

watchEffect(() => {
  const preference = AppStorage.get('colorPreference')

  let theme: ColorPreference.Dark | ColorPreference.Light

  if (preference === ColorPreference.Dark)
    theme = ColorPreference.Dark
  else if (preference === ColorPreference.Light)
    theme = ColorPreference.Light
  else
    theme = prefersDark.value ? ColorPreference.Dark : ColorPreference.Light

  if (theme === ColorPreference.Dark)
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

  <AppContent>
    <HomePage v-if="store.currentPage === Page.Home" />
    <SettingsPage v-else-if="store.currentPage === Page.Settings" />
    <LandingPage v-else-if="store.currentPage === Page.Landing" />
  </AppContent>
</template>
