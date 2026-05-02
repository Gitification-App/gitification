<script lang="ts" setup>
import type { Placement } from 'wowerlay'
import type { PopoverControl } from '../../composables/usePopoverControl'
import { whenever } from '@vueuse/core'
import { useFloatingVisibility } from '../../composables/useFloatingVisibility'
import { useTargetWrapper } from '../../composables/useTargetWrapper'
import * as UI from '../index'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {})
defineSlots<{
  default: () => any
  target: () => any
}>()
type Props = {
  control?: PopoverControl
  position: Placement
}

const { target, TargetWrapper } = useTargetWrapper()
const visible = useFloatingVisibility()

if (props.control) {
  props.control.onControl((state) => {
    if (state === 'toggle') {
      visible.value = !visible.value
    }
    else {
      visible.value = state === 'show'
    }
  })
}

whenever(() => !visible.value, () => {
  target.value?.focus({ preventScroll: true })
})
</script>

<template>
  <TargetWrapper
    data-wowerlay-stop
    :class="{
      'attention-active': visible,
    }"
    @click="visible = !visible"
  >
    <slot
      name="target"
      :visible="visible"
    />
  </TargetWrapper>

  <UI.FloatingContent
    v-model:visible="visible"
    :target="target"
    :position="position"
  >
    <slot name="default" />
  </UI.FloatingContent>
</template>
