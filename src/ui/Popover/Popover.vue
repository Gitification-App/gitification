<script lang="ts">
import type { InjectionKey, Ref } from 'vue'
import type { AlignedPlacement, Placement, Side, WowerlayTransitionFn } from 'wowerlay'
import type { PopoverControl } from '../../composables/usePopoverControl'
import { whenever } from '@vueuse/core'
import { computed, inject, onScopeDispose, provide, ref, shallowRef, useTemplateRef } from 'vue'
import { Wowerlay } from 'wowerlay'
import { useKey } from '../../composables/useKey'

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

const activePopoverId = ref<symbol | null>(null)
</script>

<script lang="ts" setup>
type Props = {
  wowerlayOptions?: Partial<Omit<InstanceType<typeof Wowerlay>['$props'], 'visible' | 'target' | 'position'>>
  control?: PopoverControl
  position: Placement
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  wowerlayOptions: () => ({}),
})

defineSlots<{
  default: (props: SlotProps) => any
  target: (props: SlotProps) => any
}>()

const symbol = Symbol('PopoverSYM')
const targetWrapper = useTemplateRef('targetWrapper')
const target = shallowRef<HTMLElement | null>(null)
const visible = computed({
  get() {
    return activePopoverId.value === symbol
  },
  set(value) {
    if (!value && activePopoverId.value !== symbol) {
      return
    }

    if (!value) {
      target.value?.focus({ preventScroll: true })
      target.value = null
    }
    else {
      target.value = (targetWrapper.value as HTMLElement).children[0] as HTMLElement
    }

    activePopoverId.value = value ? symbol : null
  },
})

onScopeDispose(() => {
  visible.value = false
})

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

provide(popoverContextKey, { visible })

useKey('esc', () => {
  visible.value = false
}, { prevent: true, source: visible })

const popoverEl = ref<HTMLElement | null>(null)

whenever(popoverEl, (el) => {
  el.focus()
}, { flush: 'post' })
</script>

<template>
  <div
    ref="targetWrapper"
    class="contents"
    data-wowerlay-stop
    @click="visible = !visible"
  >
    <slot
      name="target"
      :visible="visible"
    />
  </div>

  <Wowerlay
    v-model:visible="visible"
    tabindex="-1"
    :target="target"
    :gap="2"
    :backgroundAttrs="{
      style: { zIndex: 1500 },
    }"
    :transition="handleTransition"
    :position="props.position"
    v-bind="props.wowerlayOptions"
    class="outline-none rounded-lg bg-surface-1 border border-surface-3 shadow-md overflow-clip flex"
    @update:el="(el) => popoverEl = el"
  >
    <slot
      name="default"
      :visible="visible"
    />
  </Wowerlay>
</template>
