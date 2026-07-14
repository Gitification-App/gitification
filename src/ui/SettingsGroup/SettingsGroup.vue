<script lang="ts" setup>
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="settings-group overflow-hidden rounded-lg border border-surface-3 bg-surface-2/35">
    <h3 class="with-attention flex min-h-9 items-center gap-2 px-3 text-[13px] font-semibold text-txt-1 text-left">
      <span class="size-1.5 shrink-0 rounded-full bg-primary/80" />
      {{ title }}
    </h3>
    <div class="divide-y divide-surface-3/80">
      <slot />
    </div>
  </div>
</template>
