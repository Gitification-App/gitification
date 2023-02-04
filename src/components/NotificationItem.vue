<script lang="ts" setup>
import type { NotificationList } from '../types'
import { Icons } from './Icons'

interface Emits {
  (e: 'click', id: string): void
}

interface Props {
  data: NotificationList
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleNotificationClick(id: string) {
  emit('click', id)
}
</script>

<template>
  <div
    draggable="false"
    class="notification"
  >
    <div class="notification-title">
      <img
        class="notification-title-icon"
        src="https://avatars.githubusercontent.com/u/47540799?s=40&v=4"
        alt="repo logo"
      >
      <span class="notification-title-text">
        {{ props.data.repoFullName }}
      </span>
    </div>
    <button
      v-for="item of props.data.children"
      :key="item.id"
      class="notification-item"
      @click="handleNotificationClick(item.id)"
    >
      <Icons.PullRequest class="notification-item-icon" />

      <div class="notification-item-content">
        <div class="notification-item-content-title">
          {{ item.title }}
        </div>

        <div class="notification-item-content-subtitle">
          Review Requested - Updated 5 seconds ago
        </div>
      </div>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  + .notification {
    padding-top: 5px;
  }

  &-title {
    background-color: rgba(14, 14, 14, .72);
    border-radius: 8px;
    padding: 5px 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;

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
      color: var(--white);
      width: 100%;

      &-title {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        margin-bottom: 4px;
      }

      &-subtitle {
        width: 100%;
        font-size: 12px;
      }
    }
  }
}
</style>
