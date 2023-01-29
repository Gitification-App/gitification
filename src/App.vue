<script setup lang="ts">
import AppContent from './components/AppContent.vue'
import AppSidebar from './components/AppSidebar.vue'
import HomePage from './components/HomePage.vue'
import NotificationItem from './components/NotificationItem.vue'
import { Page } from './constants'
import { useRouteStore } from './stores/routeStore'
import { useStore } from './stores/store'

const routeStore = useRouteStore()
const store = useStore()
</script>

<template>
  <AppSidebar />

  <AppContent>
    <HomePage v-if="routeStore.currentPage === Page.Home" />

    <div v-else-if="routeStore.currentPage === Page.Settings">
      settings sayfa
    </div>
  </AppContent>
</template>

<style scoped>

</style>
