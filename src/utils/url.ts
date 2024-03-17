import type { Option } from '../types'

type CreateURLArgs = {
  url: string
  query?: Option<Record<string, string>>
}

export function createURL({ url, query }: CreateURLArgs) {
  let mURL = url

  if (query != null) {
    mURL += '?'

    const queries = [] as string[]

    for (const [key, value] of Object.entries(query)) {
      queries.push(`${key}=${value}`)
    }

    mURL += decodeURIComponent(queries.join('&'))
  }

  return mURL
}
