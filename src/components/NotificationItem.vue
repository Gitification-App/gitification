<script lang="ts" setup>
import dayjs from 'dayjs'
import type { MinimalRepository, Thread } from '../api/notifications'
import type { NotificationList } from '../types'
import { formatReason, isRepository, isThread, notificationSubjectIcon } from '../utils/notification'
import Separator from './Separator.vue'

interface Emits {
  (e: 'click:notification', notification: Thread): void
  (e: 'click:repo', repoFullName: string): void
  (e: 'update:checked', value: boolean): void
}

interface Props {
  value: NotificationList[number]
  checked?: boolean
  checkable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  checked: false,
  checkable: false,
})
const emit = defineEmits<Emits>()

function isInteractedCheckbox(e: MouseEvent | KeyboardEvent) {
  return e.target instanceof HTMLElement && e.target.closest('.notification-checkbox') != null
}

function handleThreadClick(thread: Thread, event: MouseEvent | KeyboardEvent) {
  if (!props.checkable || (event instanceof KeyboardEvent && event.repeat))
    return

  if ((event.ctrlKey || event.metaKey) || isInteractedCheckbox(event)) {
    emit('update:checked', !props.checked)
    return
  }

  emit('click:notification', thread)
}

function handleRepoClick(repo: MinimalRepository, event: MouseEvent | KeyboardEvent) {
  if (!props.checkable || (event instanceof KeyboardEvent && event.repeat))
    return

  if ((event.ctrlKey || event.metaKey) || isInteractedCheckbox(event)) {
    emit('update:checked', !props.checked)
    return
  }

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
      @click="(event) => isRepository(value) && handleRepoClick(value, event)"
    >
      <img
        class="notification-title-icon"
        :src="value.owner.avatar_url"
        alt="repo logo"
      >
      <span class="notification-title-text">
        {{ value.full_name }}
      </span>

      <div
        v-if="checkable"
        class="notification-checkbox-wrapper"
      >
        <span
          :class="{ 'notification-checkbox-checked': checked }"
          role="checkbox"
          tabindex="0"
          aria-checked="true"
          class="notification-checkbox"
          @keydown.space.enter.prevent=" (event) => isRepository(value) && handleRepoClick(value, event)"
        >
          <span class="notification-checkbox-dot" />
        </span>
      </div>
    </button>

    <Separator />
  </div>

  <button
    v-else
    class="notification-item"
    :class="{ 'notification-item-read': !value.unread }"
    @click="(event) => isThread(value) && handleThreadClick(value, event)"
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

    <div
      v-if="checkable"
      class="notification-checkbox-wrapper"
    >
      <span
        :class="{ 'notification-checkbox-checked': checked }"
        role="checkbox"
        tabindex="0"
        aria-checked="true"
        class="notification-checkbox"
        @keydown.space.enter.prevent=" (event) => isThread(value) && handleThreadClick(value, event)"
      >
        <span class="notification-checkbox-dot" />
      </span>
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
    padding: 5px 10px 5px 16px;
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
      width: 100%;
      text-align: left;
    }
  }

  &-item {
    margin-top: 5px;
    background-color: var(--item-bg);
    display: flex;
    width: 100%;
    flex-flow: row nowrap;
    padding: 8px 10px 8px 8px;
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

  &-checkbox {
    @include focus-visible;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid rgb(101, 101, 101);
    flex-shrink: 0;
    padding: 3px;
    display: inline-flex;

    &-checked {
      border-color: var(--white);

      .notification-checkbox-dot {
        background-color: var(--white);
      }
    }

    &-dot {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }

    &-wrapper {
      height: 100%;
      display: inline-flex;
      align-items: center;
      justify-content: center;

      &:hover {
        .notification-checkbox:not(.notification-checkbox-checked) {
          border-color: var(--white-faded);

          .notification-checkbox-dot {
            background-color: var(--white-faded);
          }
        }
      }
    }
  }
}
</style>
