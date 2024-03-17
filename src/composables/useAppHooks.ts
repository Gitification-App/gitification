import type { MinimalRepository, Thread } from '../api/notifications'
import { singleton } from '../utils/common'
import { useCustomHook } from './useCustomHook'

export const useAppHooks = singleton(() => {
  const [onMarkAsRead, emitMarkAsRead] = useCustomHook<[target: MinimalRepository | Thread | Thread[]]>()
  const [onOpen, emitOpen] = useCustomHook<[target: MinimalRepository | Thread]>()
  const [onRefetch, emitRefetch] = useCustomHook()
  const [onUnsubscribe, emitUnsubscribe] = useCustomHook<[target: MinimalRepository | Thread]>()

  return {
    onMarkAsRead,
    emitMarkAsRead,
    onOpen,
    emitOpen,
    onRefetch,
    emitRefetch,
    onUnsubscribe,
    emitUnsubscribe,
  }
})
