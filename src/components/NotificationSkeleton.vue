<script lang="ts" setup>
const skeletonProps = [
  {
    class: 'skeleton-header',
  },
  {
    class: 'skeleton-item',
  },
  {
    class: 'skeleton-item',
  },
  {
    class: 'skeleton-item',
  },
  {
    style: { marginTop: '5px' },
    class: 'skeleton-header',
  },
  {
    class: 'skeleton-item',
  },
  {
    class: 'skeleton-item',
  },
]
</script>

<template>
  <div
    v-for="(props, index) in skeletonProps"
    :key="index"
    v-bind="props"
  />
</template>

<style lang="scss" scoped>
@keyframes breathe {
  0% {
    opacity: .5;
  }
  100% {
    opacity: 1
  }
}

.skeleton-header,
.skeleton-item {
  animation: breathe 1s linear alternate-reverse infinite;
}

.skeleton-header {
  height: 32px;
  width: 100%;
  border-radius: 8px;
  background-color: rgba(14, 14, 14, .72);
}

.skeleton-item {
  margin-top: 5px;
  width: 100%;
  height: 62px;
  border-radius: 8px;
  background-color: var(--item-bg);
}
</style>
