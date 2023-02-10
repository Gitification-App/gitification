<script lang="ts" setup>
interface Props {
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
})
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
  border-radius: 8px;
  color: var(--white-faded);
  border: 1px solid transparent;
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
    stroke: black;
    stroke-width: 1px;
    stroke-linejoin: round;
    paint-order: stroke;
  }
}
</style>
