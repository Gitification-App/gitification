import type { Directive, DirectiveBinding } from 'vue'
import type { ContextMenuState } from '../composables/useContextMenu'
import { useContextMenu } from '../composables/useContextMenu'

const registeredElements = new WeakSet<HTMLElement>()

function directiveHandler(el: HTMLElement, binding: DirectiveBinding<ContextMenuState['itemsFn']>) {
  if (!registeredElements.has(el)) {
    registeredElements.add(el)

    const contextmenu = useContextMenu()

    el.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      contextmenu.state.value = {
        currentTarget: el,
        itemsFn: binding.value,
        targetRectFn: () => ({
          top: event.clientY,
          left: event.clientX,
          width: 0,
          height: 0,
          bottom: event.clientY,
          right: event.clientX,
          x: event.clientX,
          y: event.clientY,
          toJSON: () => {},
        }),
      }
    })
  }
}

function unmountHandler(el: HTMLElement) {
  const contextmenu = useContextMenu()

  if (contextmenu.state.value?.currentTarget === el)
    contextmenu.clear()
}

export const vContextmenu: Directive<HTMLElement, ContextMenuState['itemsFn']> = {
  mounted: directiveHandler,
  updated: directiveHandler,
  unmounted: unmountHandler,
}
