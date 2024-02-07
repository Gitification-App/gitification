<script lang="ts" setup>
type Props = {
  inline?: boolean
  dot?: boolean
}

withDefaults(defineProps<Props>(), {
  inline: false,
})
</script>

<template>
  <header
    class="header"
    :class="{ 'header-inline': inline }"
  >
    <div
      v-if="dot"
      class="header-dot"
    />

    <slot />
  </header>
</template>

<style lang="scss" scoped>
.header {
  font-size: 16px;
  color: var(--text);
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-weight: bold;

  &-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    margin-right: 8px;
  }

  &-inline {
    display: inline-block;
  }
}
</style>
