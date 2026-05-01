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
  <div class="bg-surface-2 rounded-lg pick-group flex flex-row flex-nowrap min-w-0 *:shrink-0">
    <UI.Button
      v-for="value in values"
      :key="String(value)"
      variant="ghost"
      paddingVariant="none"
      class="capitalize text-sm py-2 px-3 focus-visible:z-2"
      :class="{
        'bg-surface-5': modelValue === value,
        'text-txt-3': modelValue !== value,
      }"
      @click="$emit('update:modelValue', value)"
    >
      {{ value }}
    </UI.Button>
  </div>
</template>
