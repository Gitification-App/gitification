import { defineComponent, onMounted, onUpdated, shallowRef, useTemplateRef } from 'vue'

export function useTargetWrapper<T extends HTMLElement = HTMLElement>() {
  const target = shallowRef<T | null>(null)

  const TargetWrapper = defineComponent({
    setup(_props, { slots }) {
      const targetWrapper = useTemplateRef<T>('targetWrapper')

      onUpdated(() => {
        target.value = findTarget(targetWrapper.value)
      })
      onMounted(() => {
        target.value = findTarget(targetWrapper.value)
      })

      return () => (
        <div
          class="contents"
          ref="targetWrapper"
        >
          {slots.default?.()}
        </div>
      )
    },
  })

  return {
    target,
    TargetWrapper,
  }
}

function findTarget<T extends HTMLElement>(element: T | null): T | null {
  if (element == null) {
    return null
  }

  let current: T | null = element

  while (true) {
    if (current == null) {
      break
    }

    if (current.classList.contains('contents')) {
      current = current.children[0] as T
    }
    else {
      break
    }
  }

  return current
}
