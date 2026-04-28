import { computed, onScopeDispose, readonly, ref } from 'vue'

export function useCountDown(from: number) {
  const count = ref(from)

  const timer = setInterval(() => {
    if (count.value === 0) {
      return
    }

    count.value -= 1
  }, 1000)

  onScopeDispose(() => {
    clearInterval(timer)
  })

  return [
    computed(() => count.value === 0),
    () => {
      count.value = from
    },
  ] as const
}
