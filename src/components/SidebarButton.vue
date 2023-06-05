<script lang="ts" setup>
interface Props {
  disabled?: boolean
  highlight?: boolean
}

withDefaults(defineProps<Props>(), { disabled: false, highlight: false })
</script>

<template>
  <button
    class="sidebar-button"
    :disabled="disabled || undefined"
    :class="{
      disabled,
      'sidebar-button-highlight': highlight,
    }"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.sidebar-button {
  padding: 8px;
  width: 35px;
  border-radius: 8px;
  color: var(--text-faded);
  border: 1px solid transparent;
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @include focus-visible;
  position: relative;

  &-highlight {
    &::before {
      position: absolute;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: var(--text);
      right: 2px;
      top: 2px;
      content: '';
    }
  }

  &.disabled {
    opacity: .3;
  }

  &:not(.disabled) {
    &:active {
      background-color: var(--item-bg);

      :deep(.icon) {
        color: var(--text);
      }
    }

    &:hover {
      :deep(.icon) {
        color: var(--text);
      }
    }
  }

  :deep(.icon) {
    font-size: 16px;
  }
}
</style>
