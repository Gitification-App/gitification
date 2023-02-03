<script lang="ts" setup>
import { ref } from 'vue'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import { Icons } from '../components/Shared'
import { Page } from '../constants'
import { useRouteStore } from '../stores/routeStore'

const routeStore = useRouteStore()

function handleLogin() {
  routeStore.currentPage = Page.Home
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
