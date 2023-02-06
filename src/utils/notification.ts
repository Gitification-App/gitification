import { invoke } from '@tauri-apps/api/tauri'
import { Icons } from '../components/Icons'
import type { NotificationReason, NotificationSubject } from '../constants'
import { reasonFormatMap, subjectIconMap } from '../constants'

export function notificationSubjectIcon(subject: NotificationSubject) {
  return subjectIconMap[subject] || Icons.Question
}

export function formatReason(reason: NotificationReason) {
  return reasonFormatMap[reason] || 'Unknown reason'
}

export function playNotificationSound() {
  invoke('play_notification_sound')
}
