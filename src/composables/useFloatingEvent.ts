import type { MaybeRefOrGetter } from 'vue'
import { whenever } from '@vueuse/core'
import { computed, onScopeDispose, onWatcherCleanup, shallowRef, toValue, watch } from 'vue'

const activeSym = shallowRef<null | symbol>(null)

whenever(activeSym, () => {
  document.body.classList.add('attention-overlay')

  onWatcherCleanup(() => {
    document.body.classList.remove('attention-overlay')
  })
})

export function useFloatingVisibility() {
  const sym = Symbol('floating')

  return computed({
    get: () => activeSym.value === sym,
    set: (value) => {
      if (value) {
        activeSym.value = sym
      }
      else if (activeSym.value === sym) {
        activeSym.value = null
      }
    },
  })
}

export function hideFloatingContent() {
  activeSym.value = null
}
