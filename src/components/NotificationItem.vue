<script lang="ts" setup>
import dayjs from 'dayjs'
import type { MinimalRepository, Thread } from '../api/notifications'
import type { NotificationList } from '../types'
import { formatReason, isRepository, isThread, notificationSubjectIcon } from '../utils/notification'
import Separator from './Separator.vue'

interface Emits {
  (e: 'click:notification', notification: Thread): void
  (e: 'click:repo', repoFullName: string): void
}

interface Props {
  value: NotificationList[number]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

function handleThreadClick(thread: Thread) {
  emit('click:notification', thread)
}

function handleRepoClick(repo: MinimalRepository) {
  emit('click:repo', repo.full_name)
}
</script>

<template>
  <div
    v-if="isRepository(value)"
    class="notification-title-wrapper"
  >
    <button
      class="notification-title"
      @click="() => isRepository(value) && handleRepoClick(value)"
    >
      <img
        class="notification-title-icon"
        :src="value.owner.avatar_url"
        alt="repo logo"
      >
      <span class="notification-title-text">
        {{ value.full_name }}
      </span>
    </button>

    <Separator />
  </div>

  <button
    v-else
    class="notification-item"
    :class="{ 'notification-item-read': !value.unread }"
    @click="() => isThread(value) && handleThreadClick(value)"
  >
    <Component
      :is="notificationSubjectIcon(value.subject.type)"
      class="notification-item-icon"
    />

    <div class="notification-item-content">
      <div class="notification-item-content-title">
        {{ value.subject.title }}
      </div>

      <div class="notification-item-content-subtitle">
        {{ formatReason(value.reason) }}
        -
        {{ dayjs(value.updated_at).fromNow() }}
      </div>
    </div>
  </button>
</template>

<style lang="scss" scoped>
 * + .notification-title-wrapper {
  margin-top: 10px
}

.notification {

  &-title {
    @include focus-visible;
    @include text-outline();
    border-radius: 8px;
    padding: 5px 16px;
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    border: 1px solid transparent;
    line-height: inherit;

    &:hover,
    &:active {
      background-color: var(--item-hover-bg);
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
    margin-top: 5px;

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
