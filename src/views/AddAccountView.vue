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

    const user = await Gitification.api.getUser(accessToken)

    if (
      user != null
      && user.id !== Gitification.state.currentUser?.user.id
      && !Gitification.state.users.some(({ user: u }) => u.id === user.id)
    ) {
      Gitification.state.currentUser = {
        user,
        accessToken,
      }

      Gitification.state.users = [
        ...Gitification.state.users,
        {
          user,
          accessToken,
        },
      ]
    }

    Gitification.server.stop()
    Gitification.router.navigate('home')
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
        <template #label>
          <UI.Icons.UserAdd01 />
        </template>

        <template #heading>
          Add Account
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
            {{ Gitification.i18n.loginViaGithub }}
          </UI.Button>
        </template>
      </UI.ActionSection>
    </UI.PageContent>
  </UI.Page>
</template>
