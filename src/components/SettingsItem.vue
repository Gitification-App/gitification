<script lang="ts" setup>
import { Icons } from './Icons'

interface Props {
  enabled?: boolean
  title: string
}

interface Emits {
  (e: 'update:enabled', v: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <button
    class="settings-item"
    :class="{ 'settings-item-enabled': props.enabled }"
    @click="emit('update:enabled', !props.enabled)"
  >
    <div class="settings-item-status" />

    <div class="settings-item-title">
      {{ props.title }}
    </div>
  </button>
</template>

<style lang="scss" scoped>
.settings-item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--item-bg);
  border: 1px solid var(--item-border-color);
  padding: 8px;
  color: var(--white-faded);
  border-radius: 8px;
  @include focus-visible;
  position: relative;

  &:hover {
    border-color: var(--item-hover-bg);
  }

  &-status {
    display: none;
    top: 5px;
    right: 5px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--white);
    position: absolute;
  }

  &-enabled {
    color: var(--white);
    background-color: var(--item-hover-bg);

    .settings-item-status {
      display: block;
    }
  }

  &-title {
    width: 100%;
    height: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: currentColor;
    @include text-outline();
  }

}
</style>
