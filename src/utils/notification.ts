import type { MinimalRepository, Thread } from '../api/notifications'
import { Icons } from '../components/Icons'
import type { NotificationReason, NotificationSubject } from '../constants'
import { reasonFormatMap, subjectIconMap } from '../constants'
import type { NotificationList } from '../types'
import { isObject } from './is'

export function notificationSubjectIcon(subject: NotificationSubject) {
  return subjectIconMap[subject] || Icons.Question
}

export function formatReason(reason: NotificationReason) {
  return reasonFormatMap[reason] || 'Unknown reason'
}

export function toNotificationList(threads: Thread[]) {
  const notifications: NotificationList = []

  for (let index = 0; index < threads.length; index++) {
    const thread = threads[index]

    if (index === 0) {
      notifications.push(
        thread.repository,
        thread,
      )
      continue
    }

    const previousThread = threads[index - 1]

    if (thread.repository.id === previousThread.repository.id)
      notifications.push(thread)
    else
      notifications.push(thread.repository, thread)
  }

  return notifications
}

export function isThread(value: any): value is Thread {
  return isObject<Thread>(value) && 'reason' in value
}
export function isRepository(value: any): value is MinimalRepository {
  return isObject<MinimalRepository>(value) && 'teams_url' in value
}
