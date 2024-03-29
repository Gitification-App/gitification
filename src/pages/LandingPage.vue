<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/tauri'
import AppButton from '../components/AppButton.vue'
import { InvokeCommand } from '../constants'
import { useStore } from '../stores/store'
import { useTauriEvent } from '../composables/useTauriEvent'
import { getAccessToken } from '../api/token'
import { AppStorage } from '../storage'
import { getUser } from '../api/user'
import EmptyState from '../components/EmptyState.vue'
import { createAuthURL } from '../utils/github'
import { useTimeoutPool } from '../composables/useTimeoutPool'
import { getServerPort } from '../api/app'
import { useI18n } from '../composables/useI18n'
import { Page, useRoute } from '../composables/useRoute'
import { useCommonCalls } from '../composables/useCommonCalls'

const route = useRoute()
const processing = ref(true)
const { t } = useI18n()
const commonCalls = useCommonCalls()

useTauriEvent<string>('code', async ({ payload }) => {
  if (processing.value) {
    return
  }

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
    invoke(InvokeCommand.StopServer)
    route.go(Page.Home)
    commonCalls.fetchThreads(true)
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

const timeout = useTimeoutPool()

timeout.set('server_start', async () => {
  port = await getServerPort()
  processing.value = false
}, 1000)
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
