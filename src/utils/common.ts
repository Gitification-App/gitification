import type { Ref, UnwrapRef } from 'vue'

/**
 * Just returns value of passed ref, used for reactivity tracking.
 */
export function trackRef<T extends Ref<any>>(ref: T): UnwrapRef<T> {
  return ref.value
}
