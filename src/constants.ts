import { Mutex } from 'async-mutex'

export enum CheckedNotificationProcess {
  Unsubscribe,
  MarkAsRead,
}

export enum ColorPreference {
  System = 'system',
  Light = 'light',
  Dark = 'dark',
}

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

export enum NotificationItemType {
  Repository = 'repository',
  Thread = 'thread',
}

export enum NotificationSubject {
  CheckSuite = 'CheckSuite',
  Discussion = 'Discussion',
  Issue = 'Issue',
  Commit = 'Commit',
  RepositoryInvitation = 'RepositoryInvitation',
  PullRequest = 'PullRequest',
  RepositoryVulnerabilityAlert = 'RepositoryVulnerabilityAlert',
  Release = 'Release',
  TeamDiscussion = 'TeamDiscussion', // Added
}

export enum NotificationReason {
  ApprovalRequested = 'approval_requested', // Added
  Assign = 'assign',
  Author = 'author',
  Comment = 'comment',
  CiActivity = 'ci_activity',
  Invitation = 'invitation',
  Manual = 'manual',
  MemberFeatureRequested = 'member_feature_requested', // Added
  Mention = 'mention',
  Push = 'push', // Added
  ReviewRequested = 'review_requested',
  SecurityAdvisoryCredit = 'security_advisory_credit', // Added
  SecurityAlert = 'security_alert',
  StateChange = 'state_change',
  Subscribed = 'subscribed',
  TeamMention = 'team_mention',
  YourActivity = 'your_activity', // Added
}

// export const subjectIconMap = {
//   [NotificationSubject.CheckSuite]: Icons.Sync,
//   [NotificationSubject.Commit]: Icons.Commit,
//   [NotificationSubject.Discussion]: Icons.CommentDiscussions,
//   [NotificationSubject.Issue]: Icons.IssueOpened,
//   [NotificationSubject.PullRequest]: Icons.PullRequest,
//   [NotificationSubject.Release]: Icons.Tag,
//   [NotificationSubject.RepositoryInvitation]: Icons.Mail,
//   [NotificationSubject.RepositoryVulnerabilityAlert]: Icons.Alert,
// }
