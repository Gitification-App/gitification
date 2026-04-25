<script setup lang="ts">
import { UI } from '..'
import { useKey } from '../../composables/useKey'

const emit = defineEmits<{
  back: []
}>()

useKey('esc', () => {
  emit('back')
})
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

      <span><slot /></span>

      <UI.Key hotkey="esc" />
    </UI.Button>
  </div>
</template>
