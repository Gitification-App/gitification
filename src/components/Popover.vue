<script lang="ts">
import { type InjectionKey, type Ref, inject, onScopeDispose, provide, ref, watch } from 'vue'
import { type AlignedPlacement, type ReferenceElement, type Side, Wowerlay, type WowerlayTransitionFn } from 'wowerlay'
import { useEventListener } from '@vueuse/core'
import { useKey } from '../composables/useKey'

interface PopoverContext {
  visible: Ref<boolean>
}

interface SlotProps {
  visible: boolean
}

// We use plain string on dev mode because hot reloading brokes symbols.
const popoverContextKey: InjectionKey<PopoverContext> = import.meta.env.DEV ? 'PopoverContext' as any : Symbol('PopoverContext')

export function usePopoverContext() {
  return inject(popoverContextKey)!
}

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

const popoverVisibleHooks = new Set<(el: ReferenceElement) => void>()

const runPopoverVisibleHooks = (el: ReferenceElement) => {
  for (const cb of popoverVisibleHooks)
    cb(el)
}

export const onPopoverVisible = (cb: (el: ReferenceElement) => void) => {
  popoverVisibleHooks.add(cb)
  const cleanup = () => popoverVisibleHooks.delete(cb)
  onScopeDispose(cleanup)

  return cleanup
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
  target?: InstanceType<typeof Wowerlay>['$props']['target']
}

const visible = ref(false)

defineExpose({
  show() {
    visible.value = true
  },
  hide() {
    visible.value = false
  },
})
provide(popoverContextKey, { visible })

useKey('esc', () => {
  visible.value = false
}, { prevent: true, source: visible })

const handleTransition: WowerlayTransitionFn = (type, element, done) => {
  const placement = element.getAttribute('data-popover-placement') as AlignedPlacement | Side
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

  const oldTransformOrigin = element.style.transformOrigin
  element.style.transformOrigin = transformOriginMap[placement]

  if (type === 'leave') {
    const background = element.parentElement
    if (background) {
      background.style.setProperty('pointer-events', 'none')
      element.style.setProperty('pointer-events', 'auto')
    }
  }

  const animation = element.animate(type === 'enter' ? [from, to] : [to, from], {
    duration: 200,
    easing: 'ease',
  })

  animation.onfinish = () => {
    if (type === 'enter')
      element.style.transformOrigin = oldTransformOrigin

    done()
  }
}

const popoverEl = ref<HTMLElement | null>(null)
let lastFocusedElement: Element | null = null

watch(visible, (value) => {
  if (value) {
    lastFocusedElement = document.activeElement
    setTimeout(() => {
      popoverEl.value?.focus()
    })
    runPopoverVisibleHooks(props.target as ReferenceElement)
  }
  else {
    setTimeout(() => lastFocusedElement instanceof HTMLElement && lastFocusedElement.focus())
  }
})

useEventListener(
  () => props.target instanceof HTMLElement ? props.target : null,
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
    :gap="2"
    :backgroundAttrs="{
      style: { zIndex: 1500 },
    }"
    :transition="handleTransition"
    v-bind="props.wowerlayOptions"
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

  > * + * {
    margin-top: 2px;
  }
}
</style>
