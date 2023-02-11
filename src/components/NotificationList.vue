<script lang="ts" setup>
import type { Thread } from '../api/notifications'
import type { NotificationListData } from '../types'
import { formatReason, notificationSubjectIcon } from '../utils/notification'

interface Emits {
  (e: 'click:notification', notification: Thread): void
  (e: 'click:repo', repoFullName: string): void
}

interface Props {
  data: NotificationListData
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleNotificationClick(notification: Thread) {
  emit('click:notification', notification)
}

function handleRepoClick() {
  emit('click:repo', props.data.repoFullName)
}
</script>

<template>
  <div
    draggable="false"
    class="notification"
  >
    <button
      class="notification-title"
      @click="handleRepoClick"
    >
      <img
        class="notification-title-icon"
        :src="props.data.repoAvatarURL"
        alt="repo logo"
      >
      <span class="notification-title-text">
        {{ props.data.repoFullName }}
      </span>
    </button>
    <button
      v-for="item of props.data.items"
      :key="item.id"
      class="notification-item"
      :class="{ 'notification-item-read': !item.unread }"
      @click="handleNotificationClick(item.raw)"
    >
      <Component
        :is="notificationSubjectIcon(item.type)"
        class="notification-item-icon"
      />

      <div class="notification-item-content">
        <div class="notification-item-content-title">
          {{ item.title }}
        </div>

        <div class="notification-item-content-subtitle">
          {{ formatReason(item.reason) }}
        </div>
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  + .notification {
    margin-top: 5px;
  }

  &-title {
    @include focus-visible;
    // background-color: var(--notification-title-color);
    border-radius: 8px;
    padding: 5px 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    border: 1px solid transparent;
    line-height: inherit;

    &:hover {
      border-color: var(--item-hover-bg);
    }

    &:active {
      background-color: var(--item-border-color);
    }

    &-icon {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 16px;
    }

    &-text {
      font-weight: bold;
      font-size: 14px;
      display: inline-block;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &-item {
    margin-top: 5px;
    background-color: var(--item-bg);
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
    padding: 8px;
    align-items: center;
    border-radius: 8px;
    color: var(--white);
    border: 1px solid var(--item-border-color);
    text-align: left;
    line-height: 20px;
    @include focus-visible;
    @include text-outline($size: 1px);

    &-read {
      color: var(--white-faded) !important;
    }

    &:hover {
      background-color: var(--item-hover-bg)
    }

    &-icon {
      margin-left: 7px;
      margin-right: 15px;
      flex-shrink: 0;
      width: 18px;
      height: 18px;
    }

    &-content {
      height: 100%;
      padding-right: 15px;
      width: 100%;
      overflow: hidden;

      &-title {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        margin-bottom: 4px;
        font-weight: 500;
      }

      &-subtitle {
        width: 100%;
        font-size: 12px;
      }
    }
  }
}
</style>
