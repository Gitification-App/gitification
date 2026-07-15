<script lang="ts" setup generic="T">
import * as UI from '../index'

type Props = {
  modelValue: T
  values: T[]
}

defineProps<Props>()
defineEmits<{
  'update:modelValue': [value: T]
}>()
</script>

<template>
  <div class="pick-group flex min-w-0 flex-row flex-nowrap rounded-lg border border-surface-3 bg-surface-2/35 p-0.5 *:shrink-0">
    <UI.Button
      v-for="value in values"
      :key="String(value)"
      variant="ghost"
      paddingVariant="none"
      class="h-7 rounded-md px-2.5 text-xs capitalize focus-visible:z-2"
      :class="{
        'bg-primary/20': modelValue === value,
        'text-txt-3': modelValue !== value,
      }"
      @click="$emit('update:modelValue', value)"
    >
      {{ value }}
    </UI.Button>
  </div>
</template>
