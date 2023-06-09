import { ref, useSlots, withDirectives } from 'vue'
import { type Directive, type Ref } from 'vue'

const vRef: Directive<HTMLElement, (el: HTMLElement) => void> = (el, { value }) => value(el)

/**
 * @param slotName Target slot default value: "default"
 */
export function useSlotWithRef<SlotProps extends Record<string, any> = {}>(key = 'default') {
  const slots = useSlots()
  const element: Ref<HTMLElement | null> = ref(null)

  function handleRef(el: HTMLElement) {
    element.value = el
  }

  function renderSlot(props?: SlotProps) {
    if (key in slots) {
      const [slot] = (slots as any)[key](props)
      return withDirectives(slot, [[vRef, handleRef]])
    }

    return undefined
  }

  return {
    renderSlot,
    element,
  }
}
