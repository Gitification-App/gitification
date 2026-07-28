import type { Option } from '../../types'
import { shallowRef } from 'vue'

export const routes = ['home', 'landing', 'settings', 'about'] as const
export type RouteName = typeof routes[number]

export type CreateRouterOptions = {
  defaultPage: RouteName
}

export function createRouter({ defaultPage }: CreateRouterOptions) {
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

export type GiRouter = ReturnType<typeof createRouter>
