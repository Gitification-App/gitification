<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useTauriEvent } from '../composables/useTauriEvent'
import * as Gitification from '../gitification/index'
import * as UI from '../ui'

const processing = ref(true)

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

    const result = await Gitification.api.getUser(accessToken)

    if (result == null) {
      throw new Error('Failed to fetch user data')
    }

    const [user] = result

    if (user) {
      Gitification.state.currentUser = {
        user,
        accessToken,
      }

      Gitification.state.users.push()
      Gitification.router.navigate('home')
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
            variant="secondary"
            paddingVariant="md"
            :loading="processing"
            @click="handleLogin"
          >
            {{ Gitification.i18n.loginViaGithub }}
          </UI.Button>
        </template>
      </UI.ActionSection>
    </UI.PageContent>
  </UI.Page>
</template>
