<script lang="ts" setup>
defineProps<{
  hotkey: string
}>()
</script>

<template>
  <div
    class="font-mono min-h-[10px] min-w-[10px] inline-grid place-items-center shrink-0 text-[10px] text-cyan-200 rounded-md"
  >
    {{ hotkey.toLowerCase() }}
  </div>
</template>
