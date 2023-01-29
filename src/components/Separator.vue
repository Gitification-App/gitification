<script lang="ts">
export default {
  name: 'Separator',
}
</script>

<template>
  <div class="separator" />
</template>

<style lang="scss" scoped>
  .separator {
    width: calc(100% - 8px);
    height: 1px;
    margin: 10px auto;
    background-color: rgba(100, 100, 100, 0.150);
    // background: radial-gradient(circle, rgba(80,80,80,1) 0%, rgba(120,120,120,0) 100%, rgba(255,255,255,0) 100%);
  }
</style>
