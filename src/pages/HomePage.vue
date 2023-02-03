<script lang="ts" setup>
import { useStore } from '../stores/store'
import Separator from '../components/Separator.vue'
import NotificationItem from '../components/NotificationItem.vue'

const store = useStore()
</script>

<template>
  <div class="home">
    <NotificationItem
      v-for="notification of store.notifications"
      :key="notification.repoFullName"
      :data="notification"
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
