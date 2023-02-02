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

  + .sidebar-button {
    margin-top: 5px;
  }

  &:hover {
    background-color: rgba(22, 22, 22, .3);

    :deep(.icon) {
      color: var(--white);
    }
  }

  :deep(.icon) {
    font-size: 16px;
  }
}
</style>
