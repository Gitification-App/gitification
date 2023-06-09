import { onScopeDispose } from 'vue'

type TimeoutID = ReturnType<typeof setTimeout>

export function useTimeoutPool() {
  const timeouts = new Map<string, TimeoutID>()

  const clear = () => {
    for (const timeout of timeouts.values())
      clearTimeout(timeout)

    timeouts.clear()
  }

  onScopeDispose(clear)

  return {
    set(name: string, ...[callback, delay]: Parameters<typeof setTimeout>) {
      if (timeouts.has(name))
        clearTimeout(timeouts.get(name))

      const timeout = setTimeout(() => {
        timeouts.delete(name)
        callback()
      }, delay)

      timeouts.set(name, timeout)
    },

    cancel(name: string) {
      if (timeouts.has(name))
        clearTimeout(timeouts.get(name))

      timeouts.delete(name)
    },

    clear,
  }
}
