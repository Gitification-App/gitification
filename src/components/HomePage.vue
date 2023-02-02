<script lang="ts" setup>
import { useStore } from '../stores/store'
import NotificationItem from './NotificationItem.vue'
import Separator from './Separator.vue'

const store = useStore()
</script>

<template>
  <NotificationItem
    v-for="notification of store.notifications"
    :key="notification.repoFullName"
    :data="notification"
  />
</template>
