<script lang="ts" setup>
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="settings-item with-attention flex min-h-12 w-full flex-row items-center justify-between gap-4 px-3 py-2">
    <slot
      v-if="$slots.title"
      name="title"
    />
    <h2
      v-else
      class="with-attention min-w-0 text-[13px] font-normal text-txt-2"
    >
      {{ title }}
    </h2>

    <div class="flex shrink-0 flex-col gap-2">
      <slot />
    </div>
  </div>
</template>
