<script lang="ts">
import type { InjectionKey, Ref } from 'vue'
import type { AlignedPlacement, Side, WowerlayTransitionFn } from 'wowerlay'
import { useEventListener, whenever } from '@vueuse/core'
import { inject, provide, ref, watch } from 'vue'
import { Wowerlay } from 'wowerlay'
import { useKey } from '../composables/useKey'

type PopoverContext = {
  visible: Ref<boolean>
}

type SlotProps = {
  visible: boolean
}

// We use plain string on dev mode because hot reloading brokes symbols.
const popoverContextKey: InjectionKey<PopoverContext> = import.meta.env.DEV ? 'PopoverContext' as any : Symbol('PopoverContext')

export function usePopoverContext() {
  return inject(popoverContextKey, undefined)
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
    if (background) {
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
</script>

<script lang="ts" setup>
type Props = {
  wowerlayOptions?: Partial<Omit<InstanceType<typeof Wowerlay>['$props'], 'visible' | 'target'>>
  target?: InstanceType<typeof Wowerlay>['$props']['target']
}

type Emits = {
  (e: 'visibilityChange', visible: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  wowerlayOptions: () => ({}),
})

const emit = defineEmits<Emits>()

defineSlots<{
  default: (props: SlotProps) => any
}>()

const visible = ref(false)

watch(visible, (value) => {
  emit('visibilityChange', value)
})

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
  () => props.target instanceof HTMLElement ? props.target : null,
  'click',
  () => {
    visible.value = !visible.value
  },
  { passive: true },
)

whenever(() => props.target instanceof HTMLElement, (target) => {
  (props.target as HTMLElement).setAttribute('data-wowerlay-stop', '')
})
</script>

<template>
  <Wowerlay
    v-model:visible="visible"
    tabindex="-1"
    :target="target"
    :gap="2"
    :backgroundAttrs="{
      style: { zIndex: 1500 },
    }"
    :transition="handleTransition"
    v-bind="props.wowerlayOptions"
    class="outline-none rounded-lg bg-surface-3 shadow-md overflow-clip flex"
    @update:el="(el) => popoverEl = el"
  >
    <slot
      name="default"
      :visible="visible"
    />
  </Wowerlay>
</template>
