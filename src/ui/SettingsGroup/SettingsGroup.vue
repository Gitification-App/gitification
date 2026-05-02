<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="pl-2 settings-group space-y-3">
    <h3 class="with-attention text-txt-1 text-base font-[500] text-left">
      • {{ title }}
    </h3>
    <div class="pl-8 space-y-2">
      <slot />
    </div>
  </div>
</template>
