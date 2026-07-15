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
  <div class="border-b border-b-surface-2 shrink-0 flex flex-row gap-3 tracking-wider px-2 py-4 items-center">
    <UI.Tooltip
      position="bottom-start"
      title="Back [esc]"
    >
      <UI.Button
        variant="tertiary"
        paddingVariant="icon"
        @click="emit('back')"
      >
        <UI.Icons.ArrowLeft01 />
      </UI.Button>
    </UI.Tooltip>

    <h1 class="text-txt-2 text-sm">
      <slot />
    </h1>
  </div>
</template>
