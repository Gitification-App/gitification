<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import { Icons } from '../components/Icons'
import { Page } from '../constants'
import { useStore } from '../stores/store'
import { useTauriEvent } from '../composables/useTauriEvent'
import { getAccessToken } from '../api/token'
import { GITHUB_AUTH_URL } from '../api/constants'
import { AppStorage } from '../storage'

const store = useStore()

let processing = false

useTauriEvent<string>('code', async ({ payload }) => {
  if (processing)
    return

  processing = true

  try {
    const { data, ok } = await getAccessToken({
      clientId: import.meta.env.VITE_CLIENT_ID,
      clientSecret: import.meta.env.VITE_CLIENT_SECRET,
      code: payload,
    })

    if (!ok) {
      processing = false
      return
    }

    AppStorage.set('accessToken', data.access_token)
    store.currentPage = Page.Home
  }
  finally {
    processing = false
  }
})

function handleLogin() {
  open(GITHUB_AUTH_URL)
}
</script>

<template>
  <div class="landing">
    <Icons.Github class="github-icon" />

    <PageHeader class="landing-header">
      Welcome to Gitification
    </PageHeader>

    <div class="landing-content">
      <AppButton @click="handleLogin">
        Log in via Github
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.landing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  padding: 25px;
  align-items: center;
  justify-content: center;

  &-header {
    margin: 15px 0;
  }

  &-content {
    width: 100%;
    text-align: center;
  }

  .github-icon {
    font-size: 30px;
    color: var(--white);
  }
}
</style>
