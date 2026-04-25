<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useI18n } from '../composables/useI18n'
import { useTauriEvent } from '../composables/useTauriEvent'
import * as Gitification from '../gitification'
import * as UI from '../ui'

const processing = ref(true)
const { t } = useI18n()

const currentUser = Gitification.storage.asRef('user')

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

    const user = await Gitification.api.getUser(accessToken)
    const existingUser = Gitification.storage.get('allUsers').some((u) => u.id === user?.id)

    if (user == null || user.id === currentUser.value?.id || existingUser) {
      return
    }

    Gitification.storage.set('userAccessTokens', (prev) => ({
      ...prev,
      [user.id]: accessToken,
    }))

    Gitification.storage.set('allUsers', (prev) => [
      ...prev,
      user,
    ])

    Gitification.server.stop()
    Gitification.router.navigate('home', { fetchOnEnter: true })
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
    <UI.PageHeader @back="Gitification.router.navigate('home')">
      Add Account
    </UI.PageHeader>

    <UI.PageContent class="grid justify-center pt-[50px]">
      <UI.ActionSection>
        <template #heading>
          Adding Account
        </template>

        <template #description>
          Click button to login via GitHub and add your account.
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
