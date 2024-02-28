export function singleton<T>(fn: () => T): () => T {
  const instance = fn()
  return () => instance
}
