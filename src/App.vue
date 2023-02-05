<script setup lang="ts">
import AppContent from './components/AppContent.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './pages/HomePage.vue'
import SettingsPage from './pages/SettingsPage.vue'
import { Page } from './constants'
import { useStore } from './stores/store'
import LandingPage from './pages/LandingPage.vue'

const store = useStore()
</script>

<template>
  <AppSidebar v-if="store.currentPage !== Page.Landing" />

  <AppContent>
    <HomePage v-if="store.currentPage === Page.Home" />
    <SettingsPage v-else-if="store.currentPage === Page.Settings" />
    <LandingPage v-else-if="store.currentPage === Page.Landing" />
  </AppContent>
</template>

<style scoped>

</style>
