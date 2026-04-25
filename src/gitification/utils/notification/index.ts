import type { Gitification } from '../..'

export function isThread(value: any): value is Gitification.api.Types.Thread {
  return typeof value === 'object' && 'reason' in value
}

export function isRepository(value: any): value is Gitification.api.Types.MinimalRepository {
  return typeof value === 'object' && 'teams_url' in value
}

export function filterThreadsByRepository(threads: Gitification.api.Types.Thread[], repositoryId: number) {
  return threads.filter((thread) => thread.repository.id === repositoryId)
}

export function filterCheckedThreads(threads: Gitification.api.Types.Thread[], checkedThreadIds: Set<string>) {
  return threads.filter((thread) => checkedThreadIds.has(thread.id))
}
