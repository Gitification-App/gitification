<script lang="ts" setup>
import { useStore } from '../stores/store'
import NotificationItem from './NotificationItem.vue'
import Separator from './Separator.vue'

const store = useStore()
</script>

<template>
  <template
    v-for="(notification, index) of store.notifications"
    :key="notification.id"
  >
    <NotificationItem
      :item="notification"
    />

    <Separator v-if="index !== store.notifications.length - 1" />
  </template>
</template>
