<script lang="ts" setup>
import type { Placement } from 'wowerlay'
import { customRef, onScopeDispose } from 'vue'
import { useTargetWrapper } from '../../composables/useTargetWrapper'
import * as UI from '../index'

defineOptions({
  inheritAttrs: false,
})

withDefaults(defineProps<Props>(), {})
defineSlots<{
  default: () => any
}>()

type Props = {
  position: Placement
  title: string
}

const { target, TargetWrapper } = useTargetWrapper()
const visible = customRef((track, trigger) => {
  let timeout = -1
  let value = false

  onScopeDispose(() => {
    clearTimeout(timeout)
  })

  return {
    get() {
      track()
      return value
    },
    set(newValue: boolean) {
      clearTimeout(timeout)

      if (!newValue) {
        value = false
        trigger()
        return
      }

      timeout = window.setTimeout(() => {
        value = true
        trigger()
      }, 100)
    },
  }
})
</script>

<template>
  <TargetWrapper
    @mouseenter="visible = true"
    @mouseleave="visible = false"
    @focusin="(event: FocusEvent) => {
      visible = (event.target as HTMLElement).matches(':focus-visible')
    }"
    @focusout="visible = false"
    @click="visible = false"
  >
    <slot
      :visible="visible"
    />
  </TargetWrapper>

  <UI.FloatingContent
    :visible="visible"
    :target="target"
    :position="position"
    :detached="true"
    class="font-mono text-txt-3 text-xs px-2 py-1 pointer-events-none"
  >
    {{ title }}
  </UI.FloatingContent>
</template>
