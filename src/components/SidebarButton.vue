<template>
  <button class="sidebar-button">
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

  :deep(.icon) {
    font-size: 16px;
    stroke: black;
    stroke-width: 1px;
    stroke-linejoin: round;
    paint-order: stroke;
  }
}
</style>
