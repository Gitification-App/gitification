import { getCurrentScope, onScopeDispose } from 'vue'

export function useInterval(callback: () => void, duration: number) {
  const interval = setInterval(callback, duration)

  if (getCurrentScope())
    onScopeDispose(() => clearInterval(interval))

  return () => {
    clearInterval(interval)
  }
}
