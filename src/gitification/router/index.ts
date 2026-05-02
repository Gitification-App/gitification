import type { Option } from '../../types'
import { shallowRef } from 'vue'

export const routes = ['home', 'addAccount', 'landing', 'settings', 'about'] as const
export type RouteName = typeof routes[number]

export function createRouter(defaultPage: RouteName) {
  const previous = shallowRef<Option<RouteName>>(null)
  const current = shallowRef<RouteName>(defaultPage)

  function navigate(page: RouteName) {
    if (!routes.includes(page)) {
      throw new Error(`Invalid route: ${page}`)
    }

    previous.value = current.value
    current.value = page
  }

  function isCurrent(page: RouteName) {
    return current.value === page
  }

  return {
    previous,
    current,
    navigate,
    isCurrent,
  }
}

export type Router = ReturnType<typeof createRouter>
