import { ref, useSlots, withDirectives } from 'vue'
import { type Directive, type Ref } from 'vue'

const vRef: Directive<HTMLElement, (el: HTMLElement) => void> = (el, { value }) => value(el)

/**
 * @param slotName Target slot default value: "default"
 */
export function useSlotWithRef() {
  const slots = useSlots()
  const element: Ref<HTMLElement | null> = ref(null)

  function handleRef(el: HTMLElement) {
    element.value = el
  }

  function renderSlot() {
    if ('default' in slots) {
      const [slot] = slots.default!()
      return withDirectives(slot, [[vRef, handleRef]])
    }

    return null
  }

  return {
    renderSlot,
    element,
  }
}
