import type { NotificationSubject } from '../constants'
import type { Gitification } from '../gitification'
import type { NotificationList } from '../types'
import { Icons } from '../components/Icons'
import { subjectIconMap } from '../constants'
import { isObject } from './is'

export function notificationSubjectIcon(subject: NotificationSubject) {
  return subjectIconMap[subject] || Icons.Question
}

export function toNotificationList(threads: Gitification.Types.Api.Thread[]): NotificationList {
  const repoThreadsMap = new Map<Gitification.Types.Api.MinimalRepository['id'], Gitification.Types.Api.Thread[]>()

  for (const thread of threads) {
    const { repository } = thread

    if (!repoThreadsMap.has(repository.id)) {
      repoThreadsMap.set(repository.id, [])
    }

    repoThreadsMap.get(repository.id)!.push(thread)
  }

  return Array
    .from(repoThreadsMap.values())
    .flatMap((threadGroup) => (
      [threadGroup[0].repository, ...threadGroup]
    ))
}

export function isThread(value: any): value is Gitification.Types.Api.Thread {
  return isObject<Gitification.Types.Api.Thread>(value) && 'reason' in value
}
export function isRepository(value: any): value is Gitification.Types.Api.MinimalRepository {
  return isObject<Gitification.Types.Api.MinimalRepository>(value) && 'teams_url' in value
}

export function filterNewNotifications(previousThreads: Gitification.Types.Api.Thread[], newThreads: Gitification.Types.Api.Thread[]) {
  const newUnreadThreads = newThreads.filter((thread) => thread.unread)
  const previousUnreadThreadIds = new Set(
    previousThreads
      .filter((thread) => thread.unread)
      .map((thread) => thread.id),
  )

  return newUnreadThreads.filter((thread) => !previousUnreadThreadIds.has(thread.id))
}
