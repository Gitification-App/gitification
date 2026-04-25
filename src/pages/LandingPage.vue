<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useTauriEvent } from '../composables/useTauriEvent'
import * as Gitification from '../gitification'
import * as UI from '../ui'

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

    const user = await Gitification.api.getUser(accessToken)

    if (user) {
      Gitification.storage.set('user', user)
      Gitification.storage.set('userAccessTokens', (prev) => ({
        ...prev,
        [user.id]: accessToken,
      }))
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
  port = await Gitification.server.getPort()
  processing.value = false
})
</script>

<template>
  <UI.Page>
    <UI.PageContent class="grid place-items-center">
      <UI.ActionSection class="mb-[100px]">
        <template #label>
          Landing
        </template>
        <template #heading>
          Welcome to Gitification
        </template>

        <template #description>
          Let's start by logging in with your GitHub account.
        </template>

        <template #action>
          <UI.Button
            class="mt-2"
            variant="light"
            paddingVariant="md"
            :loading="processing"
            @click="handleLogin"
          >
            {{ t.loginViaGithub }}
          </UI.Button>
        </template>
      </UI.ActionSection>
    </UI.PageContent>
  </UI.Page>
</template>
