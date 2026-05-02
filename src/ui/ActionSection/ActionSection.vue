<script setup lang="ts">
import type { VNode } from 'vue'

const slots = defineSlots<{
  label?: () => VNode
  heading: () => VNode
  description: () => VNode
  action: () => VNode
}>()
</script>

<template>
  <div class="space-y-1">
    <div
      v-if="slots.label"
      class="with-attention text-primary text-xs font-medium mb-2"
    >
      <slot name="label" />
    </div>

    <h2 class="with-attention text-txt-1 text-xl font-semibold">
      <slot name="heading" />
    </h2>

    <p class="with-attention text-txt-2 text-sm">
      <slot name="description" />
    </p>

    <div class="flex flex-col items-start gap-2 mt-2">
      <slot name="action" />
    </div>
  </div>
</template>
