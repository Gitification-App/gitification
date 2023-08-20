import { type Directive, type DirectiveBinding } from 'vue'
import { type ContextmenuState, useContextmenu } from '../stores/contextmenu'

const registeredElements = new WeakSet<HTMLElement>()

function directiveHandler(el: HTMLElement, binding: DirectiveBinding<ContextmenuState['itemsFn']>) {
  if (!registeredElements.has(el)) {
    registeredElements.add(el)

    const contextmenu = useContextmenu()

    el.addEventListener('contextmenu', (event) => {
      event.preventDefault()
      contextmenu.state = {
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
  const contextmenu = useContextmenu()

  if (contextmenu.state?.currentTarget === el)
    contextmenu.state = null
}

export const vContextmenu: Directive<HTMLElement, ContextmenuState['itemsFn']> = {
  mounted: directiveHandler,
  updated: directiveHandler,
  unmounted: unmountHandler,
}
