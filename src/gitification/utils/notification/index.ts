import type { Gitification } from '../..'

export function isThread(value: any): value is Gitification.Types.Api.Thread {
  return typeof value === 'object' && 'reason' in value
}

export function isRepository(value: any): value is Gitification.Types.Api.MinimalRepository {
  return typeof value === 'object' && 'teams_url' in value
}

export function filterThreadsByRepository(threads: Gitification.Types.Api.Thread[], repositoryId: number) {
  return threads.filter((thread) => thread.repository.id === repositoryId)
}

export function filterCheckedThreads(threads: Gitification.Types.Api.Thread[], checkedThreadIds: Set<string>) {
  return threads.filter((thread) => checkedThreadIds.has(thread.id))
}
