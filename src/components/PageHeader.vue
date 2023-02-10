<script lang="ts" setup>
interface Props {
  inline?: boolean
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
    <slot />
  </header>
</template>

<style lang="scss" scoped>
.header {
  font-size: 16px;
  color: var(--white);

  &-inline {
    display: inline-block;
  }
}
</style>
