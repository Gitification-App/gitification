<script lang="ts" setup>
interface Props {
  title: string
}

defineProps<Props>()
</script>

<template>
  <div class="setting-item">
    <div class="setting-item-title">
      {{ title }}
    </div>
    <div class="setting-item-right">
      <slot />
    </div>
  </div>
</template>

<style lang="scss">
  .setting-item {
    display: flex;
    flex-direction: row;
    min-height: 40px;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;

    &-title,
    &-right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-title {
      color: var(--text);
      font-size: 14px;
      padding-left: 15px;
    }

    &-right {
      margin-left: 10px;
    }
  }
</style>
