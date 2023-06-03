<script lang="ts">
import { type InjectionKey, type Ref, inject, provide, ref, watch } from 'vue'
import { Wowerlay, type WowerlayTransitionFn } from 'wowerlay'
import { useEventListener } from '@vueuse/core'
import { useKey } from '../composables/useKey'

interface PopoverContext {
  visible: Ref<boolean>
}

interface SlotProps {
  visible: boolean
}

const popoverContextKey: InjectionKey<PopoverContext> = Symbol('PopoverContext')

export function usePopoverContext() {
  return inject(popoverContextKey)!
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<Props>(), {
  wowerlayOptions: () => ({}),
})

defineSlots<{
  default: (props: SlotProps) => any
}>()

interface Props {
  wowerlayOptions?: Partial<Omit<InstanceType<typeof Wowerlay>['$props'], 'visible' | 'target'>>
  target?: HTMLElement | null
}

const visible = ref(false)

provide(popoverContextKey, { visible })

useKey('esc', () => {
  visible.value = false
}, { prevent: true, source: visible })

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

const popoverEl = ref<HTMLElement | null>(null)
let lastFocusedElement: Element | null = null

watch(visible, (value) => {
  if (value) {
    lastFocusedElement = document.activeElement
    setTimeout(() => {
      popoverEl.value?.focus()
    })
  }
  else {
    setTimeout(() => lastFocusedElement instanceof HTMLElement && lastFocusedElement.focus())
  }
})

useEventListener(
  () => props.target,
  'click',
  () => {
    visible.value = !visible.value
  },
  { passive: true },
)
</script>

<template>
  <Wowerlay
    v-model:visible="visible"
    class="popover"
    tabindex="-1"
    :target="target"
    v-bind="props.wowerlayOptions"
    :gap="2"
    noBackground
    :transition="handleTransition"
    @update:el="(el) => popoverEl = el"
  >
    <slot
      name="default"
      :visible="visible"
    />
  </Wowerlay>
</template>

<style lang="scss">
.popover {
  outline: none;
  background-color: var(--popover-bg);
  min-width: 150px;
  border-radius: 8px;
  border: 1px solid #323232;
  backdrop-filter: blur(20px) saturate(180%) contrast(90%) brightness(50%);
  -webkit-backdrop-filter: blur(20px) saturate(180%) contrast(90%) brightness(50%);
  display: flex;
  flex-direction: column;
  padding: 4px;
  --wowerlay-z: 1500;

  > * + * {
    margin-top: 2px;
  }
}
</style>
