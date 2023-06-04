import type { Ref } from 'vue'
import { onMounted, onUpdated, shallowRef } from 'vue'
import type { Option } from '../types'
import { type UseKeyOptions, useKey } from './useKey'

export interface UseElementNavigationOptions {
  target: Ref<Option<HTMLElement>>
  targetQuery: string
  navigateNextHotkey: string
  navigatePreviousHotkey: string
}

export enum Navigation {
  Next,
  Previous,
}

function getFocusedItemIndex(elements: HTMLElement[], query: string) {
  const activeElement = document.activeElement!.closest(query)

  return elements
    .findIndex(item => activeElement === item)
}

const hotkeyOptions: UseKeyOptions = { prevent: true, repeat: true }

export function useElementNavigation({
  navigateNextHotkey,
  navigatePreviousHotkey,
  target,
  targetQuery,
}: UseElementNavigationOptions) {
  const elements = shallowRef<HTMLElement[]>([])

  function queryNotificationItems() {
    elements.value = Array.from(target.value?.querySelectorAll(targetQuery) || [])
  }

  onMounted(queryNotificationItems)
  onUpdated(queryNotificationItems)

  function focusItemInDirection(navigation: Navigation) {
    let currentIndex = getFocusedItemIndex(elements.value, targetQuery)

    if (navigation === Navigation.Next && currentIndex < elements.value.length - 1)
      currentIndex++
    else if (navigation === Navigation.Previous && currentIndex > 0)
      currentIndex--

    const element = elements.value[currentIndex]
    element.focus()
    element.scrollIntoView({
      inline: 'nearest',
      block: 'nearest',
    })
  }

  useKey(
    navigateNextHotkey,
    () => focusItemInDirection(Navigation.Next),
    hotkeyOptions,
  )
  useKey(
    navigatePreviousHotkey,
    () => focusItemInDirection(Navigation.Previous),
    hotkeyOptions,
  )
}
