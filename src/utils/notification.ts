import { markRaw } from 'vue'
import type { Thread } from '../api/notifications'
import { Icons } from '../components/Icons'
import type { NotificationReason, NotificationSubject } from '../constants'
import { reasonFormatMap, subjectIconMap } from '../constants'
import type { NotificationListData, NotificationListDataItem } from '../types'

export function notificationSubjectIcon(subject: NotificationSubject) {
  return subjectIconMap[subject] || Icons.Question
}

export function formatReason(reason: NotificationReason) {
  return reasonFormatMap[reason] || 'Unknown reason'
}

function notificationListItemFromThread(thread: Thread): NotificationListDataItem {
  return {
    id: thread.id,
    reason: thread.reason,
    title: thread.subject.title,
    type: thread.subject.type,
    unread: thread.unread,
    updatedAt: thread.updated_at,
    raw: markRaw(thread),
  }
}

export function notificationListFromThreads(threads: Thread[]) {
  const repoIdIndexMap: Record<Thread['repository']['id'], number> = Object.create(null)
  const notifications: NotificationListData[] = []

  for (const thread of threads) {
    const { repository } = thread

    if (repository.id in repoIdIndexMap) {
      const notification = notifications[repoIdIndexMap[repository.id]]
      notification.items.push(notificationListItemFromThread(thread))
    }
    else {
      const nextIndex = notifications.length
      const notification: NotificationListData = {
        repoAvatarURL: `${repository.owner.avatar_url}&s=40`,
        repoFullName: repository.full_name,
        items: [
          notificationListItemFromThread(thread),
        ],
      }

      repoIdIndexMap[repository.id] = nextIndex
      notifications.push(notification)
    }
  }

  return notifications
}
