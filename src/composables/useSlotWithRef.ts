import { ref, useSlots, withDirectives } from 'vue'
import type { Directive, Ref } from 'vue'

const vRef: Directive<HTMLElement, (el: HTMLElement) => void> = (el, { value }) => value(el)

/**
 * @param slotName Target slot default value: "default"
 */
export function useSlotWithRef<SlotProps extends Record<string, any> = Record<string, never>>(slotName = 'default') {
  const slots = useSlots()
  const element: Ref<HTMLElement | null> = ref(null)

  function handleRef(el: HTMLElement) {
    element.value = el
  }

  function renderSlot(props?: SlotProps) {
    if (slotName in slots) {
      const [slot] = (slots as any)[slotName](props)
      return withDirectives(slot, [[vRef, handleRef]])
    }

    return undefined
  }

  return {
    renderSlot,
    element,
  }
}
