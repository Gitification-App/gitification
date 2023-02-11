<script lang="ts" setup>
import Separator from './Separator.vue'

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
    style: { 'marginTop': '10px', '--text-width': '50%' },
    class: 'skeleton-header',
  },
  {
    class: 'skeleton-item',
  },
  {
    class: 'skeleton-item',
  },
] as const
</script>

<template>
  <template
    v-for="(props, index) in skeletonProps"
    :key="index"
  >
    <div v-bind="props">
      <template v-if="props.class === 'skeleton-header'">
        <div class="skeleton-header-logo" />
        <div class="skeleton-header-text" />
      </template>
    </div>

    <Separator v-if="props.class === 'skeleton-header'" />
  </template>
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
  padding: 5px 16px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  &-logo {
    border-radius: 50%;
    width: 16px;
    height: 16px;
    background-color: var(--item-hover-bg);
    margin-right: 16px;
  }

  &-text {
    background-color: var(--item-hover-bg);
    border-radius: 8px;
    height: 8px;
    width: var(--text-width, 60%);
  }
}

.skeleton-item {
  + .skeleton-item {
    margin-top: 5px
  };

  width: 100%;
  height: 62px;
  border-radius: 8px;
  background-color: var(--item-bg);
}
</style>
