import type { Directive } from 'vue'

export const vEl: Directive<HTMLElement, (el: HTMLElement | null) => void> = {
  mounted(el, { value }) {
    value(el)
  },
  updated(el, { value }) {
    value(el)
  },
  unmounted(el, { value }) {
    value(null)
  },
}
