import { Icons } from './components/Icons'

export const REPOSITORY_PATH = 'Gitification-App/gitification'
export const REPO_LINK = `https://github.com/${REPOSITORY_PATH}` as const
export const REPO_RELEASES_LINK = `https://github.com/${REPOSITORY_PATH}/releases` as const
export const FETCH_INTERVAL_DURATION = 60000
export const SERVER_PORTS = [23846, 15830, 12840]

export enum Page {
  Settings = 'Settings',
  Home = 'Home',
  Landing = 'Landing',
}

export enum InvokeCommand {
  PlayNotificationSound = 'play_notification_sound',
  SetIconTemplate = 'set_icon_template',
  StartServer = 'start_server',
  StopServer = 'stop_server',
  GoToNotificationSettings = 'go_to_notification_settings',
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
}

export enum NotificationItemType {
  Repository = 'repository',
  Thread = 'thread',
}

export enum NotificationReason {
  Assign = 'assign',
  Author = 'author',
  Comment = 'comment',
  CiActivity = 'ci_activity',
  Invitation = 'invitation',
  Manual = 'manual',
  Mention = 'mention',
  ReviewRequested = 'review_requested',
  SecurityAlert = 'security_alert',
  StateChange = 'state_change',
  Subscribed = 'subscribed',
  TeamMention = 'team_mention',
}

export const reasonFormatMap = {
  [NotificationReason.Assign]: 'Assign',
  [NotificationReason.Author]: 'Author',
  [NotificationReason.Comment]: 'Comment',
  [NotificationReason.Invitation]: 'Invitation',
  [NotificationReason.Manual]: 'Manual',
  [NotificationReason.Mention]: 'Mention',
  [NotificationReason.ReviewRequested]: 'Review Requested',
  [NotificationReason.SecurityAlert]: 'Security Alert',
  [NotificationReason.StateChange]: 'State Change',
  [NotificationReason.Subscribed]: 'Subscribed',
  [NotificationReason.TeamMention]: 'Team Mention',
  [NotificationReason.CiActivity]: 'CI Activity',

}

export const subjectIconMap = {
  [NotificationSubject.CheckSuite]: Icons.Sync,
  [NotificationSubject.Commit]: Icons.Commit,
  [NotificationSubject.Discussion]: Icons.CommentDiscussions,
  [NotificationSubject.Issue]: Icons.IssueOpened,
  [NotificationSubject.PullRequest]: Icons.PullRequest,
  [NotificationSubject.Release]: Icons.Tag,
  [NotificationSubject.RepositoryInvitation]: Icons.Mail,
  [NotificationSubject.RepositoryVulnerabilityAlert]: Icons.Alert,
}
