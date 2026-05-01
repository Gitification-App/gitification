<script setup lang="ts">
import * as UI from '..'
import { useKey } from '../../composables/useKey'

const emit = defineEmits<{
  back: []
}>()

useKey('esc', () => {
  emit('back')
})
</script>

<template>
  <div class="border-b border-b-surface-2 shrink-0 flex flex-row gap-2 px-2 py-3 items-center">
    <UI.Button
      variant="ghost"
      paddingVariant="md"
      @click="emit('back')"
    >
      <template #leftIcon>
        <UI.Icons.ArrowLeft01 />
      </template>

      <h1><slot /></h1>

      <UI.Key hotkey="esc" />
    </UI.Button>
  </div>
</template>
