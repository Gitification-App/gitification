/**
 * Used for singleton composable functions
 *
 * @example
 * ```ts
 * const fn = singletonFn(() => {
 *  const state = reactive({ count: 0 })
 *  const increment = () => state.count++
 *  const decrement = () => state.count--
 *  return { state, increment, decrement }
 * })
 *
 * const { state, increment, decrement } = fn()
 * ```
 */
export function singleton<T>(fn: () => T): () => T {
  const context = fn()
  return () => context
}
