<script setup lang="ts">
import { UI } from '..'

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="shrink-0 flex flex-row gap-2 items-center">
    <UI.Button
      variant="ghost"
      paddingVariant="md"
      @click="emit('back')"
    >
      <template #leftIcon>
        <UI.Icons.ArrowLeft01 />
      </template>

      <slot />
    </UI.Button>
  </div>
</template>
