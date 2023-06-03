<script lang="ts">
import { onScopeDispose, reactive, ref } from 'vue'
import { Wowerlay, type WowerlayProps, type WowerlayTransitionFn } from 'wowerlay'
import { useEventListener } from '@vueuse/core'
import { useTimeoutPool } from '../composables/useTimeoutPool'

interface Props {
  text: string
  position?: WowerlayProps['position']
  target?: HTMLElement | null
}

const handleTransition: WowerlayTransitionFn = (type, element, done) => {
  const placement = element.getAttribute('data-popover-placement')!.split('-')[0]

  const vertical = placement === 'top' || placement === 'bottom'
  const transformFunction = vertical ? 'translateY' : 'translateX'

  const from = {
    transform: `scale(0.97) ${transformFunction}(${placement === 'bottom' || placement === 'right' ? '-7px' : '7px'})`,
    opacity: 0,
  }

  const to = {
    transform: `scale(1) ${transformFunction}(0px)`,
    opacity: 1,
  }

  const animation = element.animate(type === 'enter' ? [from, to] : [to, from], {
    duration: 200,
    easing: 'ease',
  })

  animation.onfinish = done
}

/**
 * We store open tooltip ids so if user switches from a tooltip target to another tooltip target
 * new tooltip will be opened immediately without delay.
 *
 * Can be tested on sidebar switching between Reload and More buttons.
 */
export const openTooltips = reactive(new Set<number>())

const getTooltipId = (() => {
  let id = 0

  return () => id++
})()
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<Props>(), {
  position: 'bottom',
})

const visible = ref(false)
const timeout = useTimeoutPool()
const id = getTooltipId()

function handleTargetInteractionStart() {
  timeout.cancel('_')

  if (openTooltips.size > 0) {
    visible.value = true
    openTooltips.add(id)
  }
  else {
    timeout.set('_', () => {
      openTooltips.add(id)
      visible.value = true
    }, 350)
  }
}

function handleTargetInteractionEnd() {
  timeout.cancel('_')
  visible.value = false
  timeout.set('_', () => {
    openTooltips.delete(id)
  }, /** leave animation duration */200)
}

const targetGetter = () => props.target

useEventListener(targetGetter, 'mouseenter', handleTargetInteractionStart)
useEventListener(targetGetter, 'mouseleave', handleTargetInteractionEnd)
useEventListener(targetGetter, 'blur', handleTargetInteractionEnd)
useEventListener(targetGetter, 'focus', (e) => {
  if (!(e.target instanceof HTMLElement) || !e.target.hasAttribute('data-focus-visible-added'))
    return

  handleTargetInteractionStart()
})

onScopeDispose(() => {
  openTooltips.delete(id)
})
</script>

<template>
  <Wowerlay
    v-model:visible="visible"
    class="tooltip"
    :target="target"
    :gap="5"
    :transition="handleTransition"
    :position="position"
    noBackground
  >
    {{ text }}
  </Wowerlay>
</template>

<style lang="scss">
.tooltip {
  font-size: 12px;
  pointer-events: none;
  color: var(--white-faded);
  background-color: rgba(49, 49, 49, .8);
  border-radius: 8px;
  padding: 5px 8px;
  background-color: var(--popover-bg);
  border: 1px solid #323232;
  backdrop-filter: blur(20px) saturate(180%) contrast(90%) brightness(50%);
  -webkit-backdrop-filter: blur(20px) saturate(180%) contrast(90%) brightness(50%);
  --wowerlay-z: 1000;
}
</style>
