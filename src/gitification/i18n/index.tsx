import type * as Gitification from '../index'
import { Fragment } from 'vue'

const en = {
  navigateToRepository: 'Navigate to repository',
  reloadNotifications: (shortcut: string) => `Reload notifications (${shortcut})`,
  more: 'More ( . )',
  changelog: 'Changelog',
  aNewVersionIsAvailable: 'A new version is available!',
  settings: 'Settings',
  logOut: 'Log out',
  exitApp: 'Exit app',
  itsAllClear: 'It\'s all clear sir!',
  appearance: 'Appearance',
  theme: 'Theme',
  system: 'System',
  light: 'Light',
  dark: 'Dark',
  systemTitle: 'System',
  sounds: 'Sounds',
  openAtStartup: 'Open at startup',
  showSystemNotifications: 'Show system notifications',
  notificationsTitle: 'Notifications',
  showOnlyParticipating: 'Show only participating',
  showReadNotifications: 'Show read notifications',
  markAsReadOnOpen: 'Mark as read on open',
  markAsReadOpenDescription: 'When you open some notifications, Github marks them as read automaticlly, but for some it doesn\'t.',
  welcomeToGitification: 'Welcome to Gitification',
  loginViaGithub: 'Login via Github',
  oopsieCouldntLoad: 'Oopsie! Couldn\'t load notifications',
  refresh: 'Refresh',
  clearSelections: 'Clear selections',
  unsubscribe: 'Unsubscribe',
  open: 'Open',
  markAsRead: 'Mark as read',
  unsubscribeAll: 'Unsubscribe all',
  openAll: 'Open all',
  markAllAsRead: 'Mark all as read',
  selectAll: 'Select all',
  unselectAll: 'Unselect all',
  select: 'Select',
  unselect: 'Unselect',
  gitificationVersionIsAvailable: (version: string) => `Gitification ${version} is available!`,
  currentVersionIs: (version: string) => (
    <Fragment>
      Current version is
      {' '}
      <b>{version}</b>
    </Fragment>
  ),
  install: 'Install',
  reason: {
    assign: 'Assign',
    author: 'Author',
    comment: 'Comment',
    invitation: 'Invitation',
    manual: 'Manual',
    mention: 'Mention',
    review_requested: 'Review requested',
    security_alert: 'Security alert',
    state_change: 'State change',
    subscribed: 'Subscribed',
    team_mention: 'Team mention',
    ci_activity: 'CI activity',
    approval_requested: 'Approval requested',
    member_feature_requested: 'Member feature requested',
    push: 'Push',
    security_advisory_credit: 'Security advisory credit',
    your_activity: 'Your activity',
  } satisfies Record<Gitification.api.Types.NotificationReason, string>,
}

export default en
