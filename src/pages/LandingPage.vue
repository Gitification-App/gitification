<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { invoke } from '@tauri-apps/api/tauri'
import { ref } from 'vue'
import { getServerPort } from '../api/app'
import { getAccessToken } from '../api/token'
import { getUser } from '../api/user'
import AppButton from '../components/AppButton.vue'
import EmptyState from '../components/EmptyState.vue'
import { useI18n } from '../composables/useI18n'
import { useTauriEvent } from '../composables/useTauriEvent'
import { useTimeoutPool } from '../composables/useTimeoutPool'
import { InvokeCommand } from '../constants'
import { Gitification } from '../gitification'
import { createAuthURL } from '../utils/github'

const processing = ref(true)
const { t } = useI18n()

useTauriEvent<string>('code', async ({ payload }) => {
  if (processing.value) {
    return
  }

  processing.value = true

  try {
    const { data: { access_token: accessToken } } = await getAccessToken({
      clientId: import.meta.env.VITE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CLIENT_SECRET,
      code: payload,
    })

    const { data: user } = await getUser(accessToken)

    invoke(InvokeCommand.StopServer)
    Gitification.storage.assign({ accessToken, user })
    Gitification.router.navigate('home', { fetchOnEnter: true })
  }
  finally {
    processing.value = false
  }
})

let port: number

function handleLogin() {
  open(createAuthURL(port))
}

invoke(InvokeCommand.StartServer)

useTimeoutPool()
  .set(1000, 'server_start', async () => {
    port = await getServerPort()
    processing.value = false
  })
</script>

<template>
  <EmptyState :description="t.welcomeToGitification">
    <template #icon>
      <img
        width="75"
        draggable="false"
        height="75"
        src="/src/assets/img/icon.png"
      >
    </template>

    <template #footer>
      <AppButton
        :loading="processing"
        @click="handleLogin"
      >
        {{ t.loginViaGithub }}
      </AppButton>
    </template>
  </EmptyState>
</template>
