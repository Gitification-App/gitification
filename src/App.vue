<script lang="ts" setup>
import { whenever } from '@vueuse/core'
import { computed, watch } from 'vue'
import { useOauthListener } from './composables/useOauthListener'
import { usePollTick } from './composables/usePollTick'
import * as Gitification from './gitification/index'
import * as UI from './ui'
import * as Views from './views'

useOauthListener()

const Route = computed(() => {
  const current = Gitification.router.current.value

  switch (current) {
    case 'home':
      return Views.HomeView
    case 'settings':
      return Views.SettingsView
    case 'landing':
      return Views.LandingView
    case 'about':
      return Views.AboutView
    default:
      return null
  }
})

watch(
  () => Gitification.state.threads.some((t) => t.unread),
  (hasUnread) => {
    Gitification.actions.setMenubarIcon(!hasUnread)
  },
  { immediate: true },
)

watch(() => Gitification.state.theme, (theme) => {
  if (theme === 'light') {
    document.documentElement.classList.add('light')
  }
  else {
    document.documentElement.classList.remove('light')
  }
}, { immediate: true })

usePollTick(() => Gitification.actions.fetchThreads())

whenever(
  () => Gitification.state.currentUser,
  () => void Gitification.actions.fetchThreads(),
  { immediate: true },
)
</script>

<template>
  <UI.Container class="border border-surface-3 flex flex-row">
    <UI.Sidebar />
    <Route />
  </UI.Container>
</template>
