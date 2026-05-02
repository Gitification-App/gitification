<script lang="ts" setup>
import { whenever } from '@vueuse/core'
import { computed, watch, watchEffect } from 'vue'
import { useCountDown } from './composables/useCountDown'
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

const [timerZero, resetTimer] = useCountDown(60)

whenever(timerZero, () => {
  resetTimer()

  Gitification.actions
    .fetchThreads()
})

whenever(() => Gitification.state.currentUser, () => {
  resetTimer()

  Gitification.actions
    .fetchThreads()
}, { immediate: true })
</script>

<template>
  <UI.Container class="border border-surface-3 flex flex-row">
    <UI.Sidebar />
    <Route />
  </UI.Container>
</template>
