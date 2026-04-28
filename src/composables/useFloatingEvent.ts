import type { MaybeRefOrGetter } from 'vue'
import { whenever } from '@vueuse/core'
import { onWatcherCleanup, shallowRef, toValue, watch } from 'vue'

const activeSym = shallowRef<null | symbol>(null)

whenever(activeSym, () => {
  document.body.classList.add('attention-overlay')

  onWatcherCleanup(() => {
    document.body.classList.remove('attention-overlay')
  })
})

export function useFloatingShouldClose(visible: MaybeRefOrGetter<boolean>, hook: () => void) {
  const sym = Symbol('floating-event')

  watch(() => toValue(visible), (visible) => {
    if (visible) {
      activeSym.value = sym
    }
    else if (activeSym.value === sym) {
      activeSym.value = null
    }
  }, { immediate: true })

  watch(activeSym, (active) => {
    if (active !== sym) {
      hook()
    }
  })
}

export function hideFloatingContent() {
  activeSym.value = null
}
