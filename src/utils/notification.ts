import type { MinimalRepository, Thread } from '../api/notifications'
import { Icons } from '../components/Icons'
import type { NotificationSubject } from '../constants'
import { subjectIconMap } from '../constants'
import type { NotificationList } from '../types'
import { isObject } from './is'

export function notificationSubjectIcon(subject: NotificationSubject) {
  return subjectIconMap[subject] || Icons.Question
}

export function toNotificationList(threads: Thread[]): NotificationList {
  const repoThreadsMap = new Map<MinimalRepository['id'], Thread[]>()

  for (const thread of threads) {
    const { repository } = thread

    if (!repoThreadsMap.has(repository.id)) {
      repoThreadsMap.set(repository.id, [])
    }

    repoThreadsMap.get(repository.id)!.push(thread)
  }

  return Array
    .from(repoThreadsMap.values())
    .flatMap(threadGroup => (
      [threadGroup[0].repository, ...threadGroup]
    ))
}

export function isThread(value: any): value is Thread {
  return isObject<Thread>(value) && 'reason' in value
}
export function isRepository(value: any): value is MinimalRepository {
  return isObject<MinimalRepository>(value) && 'teams_url' in value
}

export function filterNewThreads(newThreads: Thread[], previousThreads: Thread[]) {
  const newUnread = newThreads.filter(t => t.unread)
  const previousUnread = previousThreads.filter(t => t.unread)

  return newUnread.filter(t => t.unread)
    .filter(thread => !previousUnread.some(pThread => pThread.id === thread.id))
}
