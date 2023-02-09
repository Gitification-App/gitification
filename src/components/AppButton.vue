<template>
  <button class="button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
.button {
  font-size: 14px;
  padding: 8px 12px;
  border: 1px solid var(--item-border-color);
  outline: none;
  background-color: var(--item-bg);
  color: var(--white);
  border-radius: 8px;
  @include focus-visible;
  @include text-outline();

  &:active {
    background-color: var(--item-hover-bg);
  }

  &:hover {
    border-color: var(--item-hover-bg);;
  }
}
</style>
