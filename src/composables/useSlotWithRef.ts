import { ref, useSlots, withDirectives } from 'vue'
import { type Directive, type Ref } from 'vue'

export interface SlotWithRefOptions {
  slotPropsGetter: () => Record<string, any>
}

const vRef: Directive<HTMLElement, (el: HTMLElement) => void> = (el, { value }) => value(el)

/**
 * @param slotName Target slot default value: "default"
 */
export function useSlotWithRef<T = HTMLElement>(slotName = 'default', options?: SlotWithRefOptions) {
  const slots = useSlots()
  const element: Ref<T | null> = ref(null)

  function handleRef(el: T) {
    element.value = el
  }

  function renderSlot() {
    if (slotName in slots) {
      const [slot, ...others] = slots[slotName]!(options?.slotPropsGetter?.())
      console.log([slot, others])
      return withDirectives(slot, [[vRef, handleRef]])
    }

    return null
  }

  return {
    renderSlot,
    element,
  }
}
