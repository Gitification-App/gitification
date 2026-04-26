<script lang="ts" setup>
import { computed, watch } from 'vue'
import * as Gitification from './gitification/index'
import * as UI from './ui'
import * as Views from './views'

const Route = computed(() => {
  const current = Gitification.router.current.value

  switch (current) {
    case 'home':
      return Views.HomeView
    case 'settings':
      return Views.SettingsView
    case 'addAccount':
      return Views.AddAccountView
    case 'landing':
      return Views.LandingView
    default:
      return null
  }
})

watch(() => Gitification.state.threads, (threads) => {
  Gitification.actions.setMenubarIcon(threads.length === 0)
}, { immediate: true })
</script>

<template>
  <UI.Container class="border border-surface-3 flex flex-row">
    <UI.Sidebar />
    <Route />
  </UI.Container>
</template>
