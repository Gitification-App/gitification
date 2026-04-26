import { Mutex } from 'async-mutex'

/**
 * This mutex helps us to synchronize the access to the GitHub API.
 * We wouldn't want to mark a thread as read while we're still fetching it.
 */
export const notificationApiMutex = new Mutex()

export const REPOSITORY_PATH = 'Gitification-App/gitification'
export const REPO_LINK = `https://github.com/${REPOSITORY_PATH}` as const
export const FETCH_INTERVAL_DURATION = 60000
export const SERVER_PORTS = [23846, 15830, 12840]

export enum InvokeCommand {
  PlayNotificationSound = 'play_notification_sound',
  SetIconTemplate = 'set_icon_template',
  StartServer = 'start_server',
  StopServer = 'stop_server',
  GoToNotificationSettings = 'go_to_notification_settings',
}
