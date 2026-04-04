import type { Option } from '../../types'
import { shallowRef } from 'vue'

type PageState = {
  fetchOnEnter?: boolean
}

export const routes = ['home', 'landing', 'settings'] as const
export type RouteName = typeof routes[number]

export function createRouter(defaultPage: RouteName) {
  const previous = shallowRef<Option<RouteName>>(null)
  const current = shallowRef<RouteName>(defaultPage)
  const pageState = shallowRef<PageState>({} as PageState)

  function navigate(page: RouteName, state: PageState = {}) {
    if (!routes.includes(page)) {
      throw new Error(`Invalid route: ${page}`)
    }

    previous.value = current.value
    current.value = page
    pageState.value = state
  }

  function isCurrent(page: RouteName) {
    return current.value === page
  }

  return {
    previous,
    current,
    pageState,
    navigate,
    isCurrent,
  }
}

export type Router = ReturnType<typeof createRouter>
