<script setup lang="ts">
import AppContent from './components/AppContent.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { Page } from './constants'
import { useRouteStore } from './stores/routeStore'
import { useStore } from './stores/store'
import LandingPage from './pages/LandingPage.vue'

const routeStore = useRouteStore()
const store = useStore()
</script>

<template>
  <AppSidebar v-if="routeStore.currentPage !== Page.Landing" />

  <AppContent>
    <HomePage v-if="routeStore.currentPage === Page.Home" />
    <SettingsPage v-else-if="routeStore.currentPage === Page.Settings" />
    <LandingPage v-else-if="routeStore.currentPage === Page.Landing" />
  </AppContent>
</template>

<style scoped>

</style>
