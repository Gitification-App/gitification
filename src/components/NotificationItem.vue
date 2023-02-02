<script lang="ts" setup>
import type { NotificationList } from '../types'
import { Icons } from './Shared'

interface Emits {
  (e: 'click'): void
}

interface Props {
  data: NotificationList
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleNotificationClick() {
  emit('click')
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
    <div
      v-for="item of props.data.children"
      :key="item.id"
      class="notification-children"
    >
      <Icons.PullRequest class="notification-children-icon" />

      <div class="notification-children-content">
        <div class="notification-children-content-title">
          {{ item.title }}
        </div>

        <div class="notification-children-content-subtitle">
          • Review Requested - Updated 5 seconds ago
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.notification {
  user-select: none;
  -webkit-user-select: none;

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

  &-children {
    margin-top: 5px;
    background-color: rgba(80, 80, 80, .3);
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
    padding: 8px;
    align-items: center;
    border-radius: 8px;
    color: var(--white);
    border: 1px solid rgb(22, 22, 22, .3);

    &:hover {
      background-color: rgba(100, 100, 100, .6);
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
