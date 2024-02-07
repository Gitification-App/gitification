<script lang="ts" setup>
import { useSlotWithRef } from '../composables/useSlotWithRef'

defineOptions({
  inheritAttrs: false,
})

defineSlots<Slots>()

type Slots = {
  default: () => any
  ref: (props: { el: HTMLElement | null }) => any
}

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
