import { onScopeDispose } from 'vue'

class TimeoutPool {
  private timeouts = new Map<string, number>()

  public set(duration: number, callback: () => unknown): () => void
  public set(duration: number, key: string, callback: () => unknown): () => void
  public set(duration: number, keyOrCallback: string | (() => unknown), callbackOrUndefined?: () => unknown): () => void {
    const key = typeof keyOrCallback === 'string'
      ? keyOrCallback
      : Math.random().toString(36).slice(2)
    const callback = typeof keyOrCallback === 'function'
      ? keyOrCallback
      : callbackOrUndefined

    if (this.timeouts.has(key)) {
      window.clearTimeout(this.timeouts.get(key))
      this.timeouts.delete(key)
    }

    const timeout = window.setTimeout(() => {
      this.timeouts.delete(key)
      callback?.()
    }, duration)

    this.timeouts.set(key, timeout)

    return () => {
      window.clearTimeout(timeout)
      this.timeouts.delete(key)
    }
  }

  public clearAll() {
    for (const timeout of this.timeouts.values()) {
      window.clearTimeout(timeout)
    }

    this.timeouts.clear()
  }

  public clear(key: string) {
    if (this.timeouts.has(key)) {
      window.clearTimeout(this.timeouts.get(key))
      this.timeouts.delete(key)
    }
  }
}

export function useTimeoutPool() {
  const pool = new TimeoutPool()

  onScopeDispose(() => {
    pool.clearAll()
  })

  return pool
}
