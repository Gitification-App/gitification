<script lang="ts" setup>
import type { AlignedPlacement, Side, WowerlayProps, WowerlayTransitionFn } from 'wowerlay'
import { Wowerlay } from 'wowerlay'
import { useFloatingShouldClose } from '../../composables/useFloatingEvent'
import { useKey } from '../../composables/useKey'

type Props = {
  target: WowerlayProps['target'] | null | undefined
  position: WowerlayProps['position']
  visible: WowerlayProps['visible']
  detached?: boolean
}

type Emits = {
  'update:visible': [visible: boolean]
  'update:el': [el: HTMLElement | null]
}

const props = withDefaults(defineProps<Props>(), {
  detached: false,
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

useFloatingShouldClose(source, () => {
  emit('update:visible', false)
})

useKey('esc', () => {
  emit('update:visible', false)
}, { prevent: true, source })
</script>

<template>
  <Wowerlay
    :visible="visible"
    tabindex="-1"
    :target="target"
    :position="position"
    :gap="2"
    :no-background="detached"
    :backgroundAttrs="{
      style: { zIndex: 1500 },
    }"
    :transition="handleTransition"
    class="outline-none rounded-lg bg-surface-1 border border-surface-3 shadow-md overflow-clip flex"
    @update:visible="emit('update:visible', $event)"
    @update:el="(el) => {
      if (!detached && el) {
        el.focus({ preventScroll: true })
      }
      emit('update:el', el);
    }"
  >
    <slot
      name="default"
      :visible="visible"
    />
  </Wowerlay>
</template>
