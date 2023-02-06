<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { useStore } from '../stores/store'
import Separator from '../components/Separator.vue'
import NotificationItem from '../components/NotificationItem.vue'
import { useInterval } from '../composables/useInterval'
import type { Thread } from '../api/notifications'
import { toGithubWebURL } from '../utils/github'
import { AppStorage } from '../storage'

const store = useStore()

store.fetchNotifications()
useInterval(store.fetchNotifications, 60000)

function handleNotificationClick(notification: Thread) {
  const url = toGithubWebURL({ notification, userId: AppStorage.get('user')!.id })
  open(url)
}
</script>

<template>
  <div class="home">
    <NotificationItem
      v-for="notification of store.notifications"
      :key="notification.repoFullName"
      :data="notification"
      @click:notification="handleNotificationClick"
    />
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
  }
</style>
