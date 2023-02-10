<script lang="ts" setup>
interface Props {
  disabled?: boolean
}

withDefaults(defineProps<Props>(), { disabled: false })
</script>

<template>
  <button
    class="sidebar-button"
    :disabled="disabled || undefined"
    :class="{ disabled }"
  >
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.sidebar-button {
  padding: 8px;
  width: 35px;
  border-radius: 8px;
  color: var(--white-faded);
  border: 1px solid transparent;
  width: 35px;
  height: 35px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  @include focus-visible;

  &.disabled {
    opacity: .3;
  }

  &:not(.disabled) {
    &:active {
      background-color: var(--item-hover-bg);

      :deep(.icon) {
        color: var(--white);
      }
    }

    &:hover {
      :deep(.icon) {
        color: var(--white);
      }
    }
  }

  :deep(.icon) {
    font-size: 16px;
  }
}
</style>
