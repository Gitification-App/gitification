<script lang="ts" setup>
defineProps<{
  hotkey: string
}>()
</script>

<template>
  <div
    class="min-h-[10px] min-w-[10px] inline-grid place-items-center shrink-0 text-[10px] border border-surface-3 bg-surface-4 text-txt-3 rounded-md"
    :class="{
      'aspect-[1/1] leading-0 p-2': hotkey.length === 1,
      'px-2 py-0.5': hotkey.length > 1,
    }"
  >
    {{ hotkey }}
  </div>
</template>
