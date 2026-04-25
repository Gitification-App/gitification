<script lang="ts" setup>
import { computed } from 'vue'
import { Gitification } from './gitification'
import { UI } from './ui'
import { View } from './views'

const Route = computed(() => {
  const current = Gitification.router.current.value

  if (current === 'landing') {
    return View.LandingView
  }
  else if (current === 'addAccount') {
    return View.AddAccountView
  }

  return () => null
})
</script>

<template>
  <UI.Container class="flex flex-row gap-2">
    <UI.Sidebar />
    <Route />
  </UI.Container>
</template>
