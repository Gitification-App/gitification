<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { ref } from 'vue'
import AppButton from '../components/AppButton.vue'
import { Page } from '../constants'
import { useStore } from '../stores/store'
import { useTauriEvent } from '../composables/useTauriEvent'
import { getAccessToken } from '../api/token'
import { GITHUB_AUTH_URL } from '../api/constants'
import { AppStorage } from '../storage'
import { getUser } from '../api/user'
import EmptyState from '../components/EmptyState.vue'

const store = useStore()

const processing = ref(false)

useTauriEvent<string>('code', async ({ payload }) => {
  if (processing.value)
    return

  processing.value = true

  try {
    const { data: { access_token } } = await getAccessToken({
      clientId: import.meta.env.VITE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CLIENT_SECRET,
      code: payload,
    })

    const { data: user } = await getUser(access_token)

    AppStorage.set('accessToken', access_token)
    AppStorage.set('user', user)
    store.setPage(Page.Home)
    store.fetchNotifications(true)
  }
  finally {
    processing.value = false
  }
})

function handleLogin() {
  open(GITHUB_AUTH_URL)
}
</script>

<template>
  <EmptyState description="Welcome to Gitification">
    <template #icon>
      <img
        width="75"
        height="75"
        src="/src/assets/img/icon.png"
      >
    </template>

    <template #footer>
      <AppButton
        :loading="processing"
        @click="handleLogin"
      >
        Log in via Github
      </AppButton>
    </template>
  </EmptyState>
</template>
