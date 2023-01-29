<script lang="ts" setup>
import type { NotificationItem } from '../types'

interface Emits {
  (e: 'click'): void
}

interface Props {
  item: NotificationItem
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleNotificationClick() {
  emit('click')
}
</script>

<template>
  <div
    class="notification-item"
    @click="handleNotificationClick"
  >
    <div class="notification-item-repo-name">
      {{ props.item.repoFullName }}
    </div>
    <div class="notification-item-title">
      <span class="notification-item-title-content">
        {{ props.item.title }}
      </span>
      <div class="notification-item-title-footer">
        10 seconds ago
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification-item {
  &-title {
    background-color: rgb(22, 22, 22, .6);
    margin-top: 5px;
    border-radius: 8px;
    border: 1px solid rgb(50, 50, 50);
    padding: 5px 10px;

    &-content {
      font-size: 14px;
      color: rgb(200, 200, 200);
    }

    &-footer {
      text-align: right;
      font-size: 12px;
      color: rgb(150, 150, 150);
    }
  }

  &-repo-name {
    font-size: 14px;
    padding: 5px 10px;
    background-color: rgba(22, 22, 22, .8);
    border-radius: 8px;
    color: rgb(200, 200, 200);
    font-weight: bold;
  }
}
</style>
