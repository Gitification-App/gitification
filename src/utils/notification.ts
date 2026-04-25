import type { NotificationSubject } from '../constants'
import type { Gitification } from '../gitification'
import type { NotificationList } from '../types'
import { Icons } from '../components/Icons'
import { subjectIconMap } from '../constants'
import { isObject } from './is'

export function notificationSubjectIcon(subject: NotificationSubject) {
  return subjectIconMap[subject] || Icons.Question
}

export function toNotificationList(threads: Gitification.api.Types.Thread[]): NotificationList {
  const repoThreadsMap = new Map<Gitification.api.Types.MinimalRepository['id'], Gitification.api.Types.Thread[]>()

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

export function isThread(value: any): value is Gitification.api.Types.Thread {
  return isObject<Gitification.api.Types.Thread>(value) && 'reason' in value
}
export function isRepository(value: any): value is Gitification.api.Types.MinimalRepository {
  return isObject<Gitification.api.Types.MinimalRepository>(value) && 'teams_url' in value
}

export function filterNewNotifications(previousThreads: Gitification.api.Types.Thread[], newThreads: Gitification.api.Types.Thread[]) {
  const newUnreadThreads = newThreads.filter((thread) => thread.unread)
  const previousUnreadThreadIds = new Set(
    previousThreads
      .filter((thread) => thread.unread)
      .map((thread) => thread.id),
  )

  return newUnreadThreads.filter((thread) => !previousUnreadThreadIds.has(thread.id))
}
