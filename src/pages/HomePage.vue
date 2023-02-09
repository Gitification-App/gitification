<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { useStore } from '../stores/store'
import Separator from '../components/Separator.vue'
import NotificationItem from '../components/NotificationItem.vue'
import { useInterval } from '../composables/useInterval'
import type { Thread } from '../api/notifications'
import { toGithubWebURL } from '../utils/github'
import { AppStorage } from '../storage'
import NotificationSkeleton from '../components/NotificationSkeleton.vue'
import { Page } from '../constants'

const store = useStore()

store.fetchNotifications(store.pageFrom === Page.Landing || store.notifications.length === 0)
useInterval(store.fetchNotifications, 60000)

function handleNotificationClick(notification: Thread) {
  const url = toGithubWebURL({ notification, userId: AppStorage.get('user')!.id })
  open(url)
}

function handleRepoClick(repoFullName: string) {
  open(`https://github.com/${repoFullName}`)
}
</script>

<template>
  <div class="home">
    <NotificationSkeleton v-if="store.skeletonVisible" />

    <template v-else>
      <NotificationItem
        v-for="notification of store.notifications"
        :key="notification.repoFullName"
        :data="notification"
        @click:notification="handleNotificationClick"
        @click:repo="handleRepoClick"
      />
    </template>
  </div>
</template>

<style lang="scss" scoped>
  .home {
    padding: 10px;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    scroll-padding-top: 5px;
    scroll-padding-bottom: 5px;
  }
</style>
