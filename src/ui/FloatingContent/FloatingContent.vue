<script lang="ts" setup>
import type { AlignedPlacement, Side, WowerlayProps, WowerlayTransitionFn } from 'wowerlay'
import { shallowRef, watch } from 'vue'
import { Wowerlay } from 'wowerlay'
import { useKey } from '../../composables/useKey'
import { useTauriEvent } from '../../composables/useTauriEvent'

type Props = {
  target: WowerlayProps['target'] | null | undefined
  position: WowerlayProps['position']
  gap?: WowerlayProps['gap']
  visible: WowerlayProps['visible']
  detached?: boolean
  noTransition?: boolean
}

type Emits = {
  'update:visible': [visible: boolean]
  'update:el': [el: HTMLElement | null]
}

const props = withDefaults(defineProps<Props>(), {
  detached: false,
  gap: 2,
})
const emit = defineEmits<Emits>()

const transformOriginMap: Record<AlignedPlacement | Side, string> = {
  'bottom-end': 'right top',
  'bottom-start': 'left top',
  'bottom': 'center top',
  'left-end': 'right bottom',
  'left-start': 'right top',
  'left': 'right center',
  'right-end': 'left bottom',
  'right-start': 'left top',
  'right': 'left center',
  'top-end': 'right bottom',
  'top-start': 'left bottom',
  'top': 'center bottom',
}

const handleTransition: WowerlayTransitionFn = (type, { popover }, done) => {
  const placement = popover.getAttribute('data-popover-placement') as AlignedPlacement | Side
  const side = placement.split('-')[0] as Side

  const vertical = side === 'top' || side === 'bottom'
  const transformFunction = vertical ? 'translateY' : 'translateX'

  const from = {
    transform: `scale(0.97) ${transformFunction}(${side === 'bottom' || side === 'right' ? '-3px' : '3px'})`,
    opacity: 0,
  }

  const to = {
    transform: `scale(1) ${transformFunction}(0px)`,
    opacity: 1,
  }

  const oldTransformOrigin = popover.style.transformOrigin
  popover.style.transformOrigin = transformOriginMap[placement]

  if (type === 'leave') {
    const background = popover.parentElement
    if (background && background.classList.contains('wowerlay-background')) {
      background.style.setProperty('pointer-events', 'none')
      popover.style.setProperty('pointer-events', 'auto')
    }
  }

  const animation = popover.animate(type === 'enter' ? [from, to] : [to, from], {
    duration: 200,
    easing: 'ease',
  })

  animation.onfinish = () => {
    if (type === 'enter') {
      popover.style.transformOrigin = oldTransformOrigin
    }

    done()
  }
}

const source = () => !props.detached && props.visible && props.target != null

let origin = null as HTMLElement | null

watch(source, (value) => {
  if (value) {
    origin = document.activeElement as HTMLElement
  }
  else {
    origin?.focus({ preventScroll: true })
    origin = null
  }
}, { flush: 'pre' })

function updateVisibleFalse() {
  if (!props.visible) {
    return
  }

  emit('update:visible', false)
}

useKey('esc', updateVisibleFalse, { prevent: true, source })
useTauriEvent('window:hidden', updateVisibleFalse)

const didFocus = shallowRef(false)
</script>

<template>
  <Wowerlay
    tabindex="-1"
    :visible
    :target
    :position
    :gap
    :no-background="detached"
    :backgroundAttrs="{
      style: { zIndex: 1500 },
    }"
    :transition="noTransition ? undefined : handleTransition"
    class="outline-none rounded-lg overflow-clip bg-surface-1 border border-surface-3 shadow-md flex"
    @update:visible="emit('update:visible', $event)"
    @update:el="(el) => {
      if (!didFocus && !detached && el) {
        didFocus = true
        el.focus({ preventScroll: true })
      }
      emit('update:el', el);
    }"
  >
    <slot
      name="default"
      :visible
    />
  </Wowerlay>
</template>
