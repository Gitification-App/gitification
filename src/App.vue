<script lang="ts" setup>
import { computed, watch, watchEffect } from 'vue'
import { useTauriEvent } from './composables/useTauriEvent'
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
    case 'about':
      return Views.AboutView
    default:
      return null
  }
})

watchEffect(() => {
  Gitification.actions.setMenubarIcon(
    !Gitification.state.threads.some((t) => t.unread),
  )
})

watch(() => Gitification.state.theme, (theme) => {
  if (theme === 'light') {
    document.documentElement.classList.add('light')
  }
  else {
    document.documentElement.classList.remove('light')
  }
}, { immediate: true })

useTauriEvent('window:hidden', () => {
  if (Gitification.state.currentUser != null) {
    Gitification.router.navigate('home')
  }
})
</script>

<template>
  <UI.Container class="border border-surface-3 flex flex-row">
    <UI.Sidebar />
    <Route />
  </UI.Container>
</template>
