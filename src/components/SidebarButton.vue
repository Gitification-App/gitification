<template>
  <button class="sidebar-button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.sidebar-button {
  padding: 8px;
  border-radius: 8px;
  color: rgb(165, 165 ,165);

  &:hover {
    background-color: rgba(22, 22, 22, .3);

    :deep(.icon) {
      color: rgba(255, 255, 255);
    }
  }

  :deep(.icon) {
    font-size: 16px;
  }
}
</style>
