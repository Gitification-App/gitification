<script lang="ts" setup>
import { computed } from 'vue'
import { Gitification } from './gitification'
import LandingPage from './pages/LandingPage.vue'
import { UI } from './ui'

const Route = computed(() => {
  const current = Gitification.router.current.value

  if (current === 'landing') {
    return LandingPage
  }

  return null
})
</script>

<template>
  <UI.Container class="flex flex-row gap-2">
    <UI.Sidebar />
    <Route />
  </UI.Container>
</template>
