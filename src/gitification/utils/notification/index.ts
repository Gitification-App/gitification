import type { MinimalRepository, Thread } from '../../../api/notifications'

export function isThread(value: any): value is Thread {
  return typeof value === 'object' && 'reason' in value
}
export function isRepository(value: any): value is MinimalRepository {
  return typeof value === 'object' && 'teams_url' in value
}
