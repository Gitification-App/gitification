import { tryOnScopeDispose } from '@vueuse/core'
import hotkeys, { type HotkeysEvent } from 'hotkeys-js'
import { type Ref, isRef, unref, watch } from 'vue'

type MaybeRef<T> = T | Ref<T>

export interface UseKeyOptions {
  prevent?: MaybeRef<boolean>
  stop?: MaybeRef<boolean>
  repeat?: MaybeRef<boolean>
  input?: MaybeRef<boolean>
  source?: (() => boolean) | Ref<boolean>
}

export type UseKeyCallback = (event: KeyboardEvent, hotkeysEvent: HotkeysEvent) => void

const getLast = <T>(arr: T[]) => arr[arr.length - 1]

function isInputing() {
  return document.activeElement instanceof HTMLTextAreaElement
  || document.activeElement?.hasAttribute('contenteditable')
  || document.activeElement instanceof HTMLInputElement
  || document.activeElement instanceof HTMLSelectElement
}

hotkeys.filter = () => true

const bindings = new Map<string, UseKeyCallback[]>()

/**
 * @source https://github.com/kadiryazici/use-key-composable-vue3/blob/main/src/composables/useKey.ts
 */
export function useKey(
  keys: string,
  callback: UseKeyCallback,
  {
    source, //
    input = false,
    prevent = false,
    repeat = false,
    stop = false,
  }: UseKeyOptions = {},
) {
  let initialized = false

  const keyList = keys
    .split(',')
    .map(key => key.trim())
    .filter(Boolean)

  const handler: UseKeyCallback = (event, hotkeysEvent) => {
    if (!unref(input) && isInputing())
      return
    if (unref(prevent))
      event.preventDefault()
    if (unref(stop))
      event.stopPropagation()
    if (!unref(repeat) && event.repeat)
      return

    callback(event, hotkeysEvent)
  }

  const init = () => {
    if (initialized)
      return

    initialized = true

    for (const key of keyList) {
      if (bindings.has(key)) {
        bindings.set(key, [...bindings.get(key)!, handler])
      }
      else {
        bindings.set(key, [handler])
        hotkeys(key, (...args) => {
          const func = getLast(bindings.get(key)!)
          func(...args)
        })
      }
    }
  }

  const destroy = () => {
    if (!initialized)
      return

    initialized = false

    for (const key of keyList) {
      bindings.set(
        key,
        bindings.get(key)!.filter(cb => cb !== handler),
      )
      if (bindings.get(key)!.length === 0) {
        bindings.delete(key)
        hotkeys.unbind(key)
      }
    }
  }

  if (isRef(source) || typeof source === 'function') {
    watch(
      source,
      (newSourceValue) => {
        if (newSourceValue)
          init()
        else destroy()
      },
      { immediate: true, flush: 'post' },
    )
  }
  else {
    init()
  }

  tryOnScopeDispose(destroy)

  return destroy
}
