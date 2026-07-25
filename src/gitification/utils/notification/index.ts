import type { Types as ApiTypes } from '../../api'

export function isThread(value: any): value is ApiTypes.Thread {
  return typeof value === 'object' && 'reason' in value
}

export function isRepository(value: any): value is ApiTypes.MinimalRepository {
  return typeof value === 'object' && 'teams_url' in value
}

export function filterThreadsByRepository(threads: ApiTypes.Thread[], repositoryId: number) {
  return threads.filter((thread) => thread.repository.id === repositoryId)
}

export function filterCheckedThreads(threads: ApiTypes.Thread[], checkedThreadIds: Set<string>) {
  return threads.filter((thread) => checkedThreadIds.has(thread.id))
}
