<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="settings-group overflow-hidden space-y-2">
    <h3 class="with-attention flex min-h-9 items-center gap-2 px-3 text-[13px] font-bold text-txt-1 text-left">
      {{ title }}
    </h3>
    <div class="rounded-lg border border-surface-3 light:bg-surface-2/60 bg-surface-2/35 divide-y divide-surface-3/80">
      <slot />
    </div>
  </div>
</template>
