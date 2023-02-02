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

  &:hover {
    background-color: rgba(55, 55, 55, 0.7);

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
