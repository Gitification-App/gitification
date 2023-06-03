import { ref, useSlots, withDirectives } from 'vue'
import { type Directive, type Ref } from 'vue'

const vRef: Directive<HTMLElement, (el: HTMLElement) => void> = (el, { value }) => value(el)

/**
 * @param slotName Target slot default value: "default"
 */
export function useSlotWithRef<T = HTMLElement>(slotName = 'default') {
  const slots = useSlots()
  const element: Ref<T | null> = ref(null)

  function handleRef(el: T) {
    element.value = el
  }

  function renderSlot(props: any) {
    if (slotName in slots) {
      const [slot] = slots[slotName]!(props)
      return withDirectives(slot, [[vRef, handleRef]])
    }

    return null
  }

  return {
    renderSlot,
    element,
  }
}
