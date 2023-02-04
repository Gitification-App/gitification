import { Icons } from '../components/Icons'
import type { NotificationReason, NotificationSubject } from '../constants'
import { reasonFormatMap, subjectIconMap } from '../constants'

export function notificationSubjectIcon(subject: NotificationSubject) {
  return subjectIconMap[subject] || Icons.Question
}

export function formatReason(reason: NotificationReason) {
  return reasonFormatMap[reason] || 'Unknown reason'
}
