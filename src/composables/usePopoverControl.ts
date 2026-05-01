import { useCustomHook } from './useCustomHook'

export type PopoverControl = {
  onControl: (callback: (state: 'show' | 'hide' | 'toggle') => void) => void
  show: () => void
  hide: () => void
  toggle: () => void
}

export function usePopoverControl(): PopoverControl {
  const [onControl, emitControl] = useCustomHook<[type: 'show' | 'hide' | 'toggle']>()

  function show() {
    emitControl('show')
  }

  function hide() {
    emitControl('hide')
  }

  function toggle() {
    emitControl('toggle')
  }

  return {
    onControl,
    show,
    hide,
    toggle,
  }
}
