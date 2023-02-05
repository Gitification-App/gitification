import type { Option } from '../types'

/**
 * Returns batched function, only runs latest call in next event loop.
 */
export function batchFn<T extends (...args: any[]) => void>(fn: T) {
  let timeout: Option<ReturnType<typeof setTimeout>> = null

  return (...args: Parameters<T>) => {
    if (timeout)
      clearTimeout(timeout)

    timeout = setTimeout(() => {
      fn(...args)
    }, 0)
  }
}
