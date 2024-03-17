import { inject } from 'vue'
import type { ComputedRef, InjectionKey } from 'vue'

export const scrollElementInjectionKey: InjectionKey<ComputedRef<HTMLElement>> = Symbol('scrollElement')

export function useScrollElement() {
  return inject(scrollElementInjectionKey)!
}
