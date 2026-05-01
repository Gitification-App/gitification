<script lang="ts" setup>
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="settings-item flex flex-row justify-between items-center w-full">
    <slot
      v-if="$slots.title"
      name="title"
    />
    <h2
      v-else
      class="text-[15px] font-[300] tracking-tight text-txt-2"
    >
      {{ title }}
    </h2>

    <div class="flex flex-col gap-2">
      <slot />
    </div>
  </div>
</template>
