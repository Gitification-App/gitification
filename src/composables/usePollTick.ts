import * as Gitification from '../gitification'
import { useTauriEvent } from './useTauriEvent'

export function usePollTick(
  callback: () => void | Promise<void>,
) {
  let polling = false

  return useTauriEvent('poll_tick', () => {
    const interval = Gitification.state.settings.pollInterval * 1000

    if (polling || Date.now() - Gitification.actions.getLastFetchThreadsAt() < interval) {
      return
    }

    polling = true

    void Promise.resolve(callback())
      .catch(() => {})
      .finally(() => {
        polling = false
      })
  })
}
