import { tryOnScopeDispose } from '@vueuse/core'

/**
 * @example
 * ```ts
 * const [onCreate, emitCreate] = useCustomHook<[id: number]>();
 * onCreate((id) => console.log('created', id));
 * emitCreate(1);
 * ```
 */
export function useCustomHook<const T extends readonly unknown[] = []>() {
  const hooks = new Set<(...args: T) => void>()

  let disposed = false

  tryOnScopeDispose(() => {
    disposed = true
    hooks.clear()
  })

  function emit(...args: T) {
    if (disposed) {
      return
    }

    for (const hook of hooks) {
      hook(...args)
    }
  }

  function on(hook: (...args: T) => void) {
    if (disposed) {
      return () => {}
    }

    hooks.add(hook)
    tryOnScopeDispose(() => hooks.delete(hook))

    return () => {
      hooks.delete(hook)
    }
  }

  function clear() {
    hooks.clear()
  }

  return [on, emit, clear] as const
}
