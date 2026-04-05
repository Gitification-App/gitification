<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import AppButton from '../components/AppButton.vue'
import EmptyState from '../components/EmptyState.vue'
import { useI18n } from '../composables/useI18n'
import { useTauriEvent } from '../composables/useTauriEvent'
import { Gitification } from '../gitification'
import { UI } from '../ui'

const processing = ref(true)
const { t } = useI18n()

useTauriEvent<string>('code', async ({ payload }) => {
  if (processing.value) {
    return
  }

  processing.value = true

  try {
    const { data: { access_token: accessToken } } = await Gitification.api.getAccessToken({
      clientId: import.meta.env.VITE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CLIENT_SECRET,
      code: payload,
    })

    Gitification.storage.set('accessToken', accessToken)

    const user = await Gitification.api.getUser()

    if (user) {
      Gitification.server.stop()
      Gitification.storage.set('user', user)
      Gitification.router.navigate('home', { fetchOnEnter: true })
    }
  }
  finally {
    processing.value = false
  }
})

let port: number

function handleLogin() {
  Gitification.actions.openURL(Gitification.utils.github.createCodeCallbackURL(port))
}

onMounted(async () => {
  await Gitification.server.start()
  port = await Gitification.server.getPort()
  processing.value = false
})
</script>

<template>
  <UI.Page>
    <UI.PageContent>
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
    </UI.PageContent>
  </UI.Page>
</template>
