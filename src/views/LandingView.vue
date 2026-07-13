<script lang="ts" setup>
import * as Gitification from '../gitification/index'
import * as UI from '../ui'

function handleLogin() {
  Gitification.auth.openAuthorization()
}
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
            @click="handleLogin"
          >
            {{ Gitification.i18n.loginViaGithub }}
          </UI.Button>
        </template>
      </UI.ActionSection>
    </UI.PageContent>
  </UI.Page>
</template>
