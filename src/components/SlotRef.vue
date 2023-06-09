<script lang="ts" setup>
import { useSlotWithRef } from '../composables/useSlotWithRef'

defineOptions({
  inheritAttrs: false,
})

interface Slots {
  default: () => any
  ref: (props: { el: HTMLElement | null }) => any
}

defineSlots<Slots>()

const { renderSlot, element } = useSlotWithRef()
</script>

<template>
  <Component
    :is="renderSlot()"
    v-bind="$attrs"
  />

  <slot
    name="ref"
    :el="element"
  />
</template>
