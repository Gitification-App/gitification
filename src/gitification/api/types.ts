export type NotificationSubject
  = | 'CheckSuite'
    | 'Discussion'
    | 'Issue'
    | 'Commit'
    | 'RepositoryInvitation'
    | 'PullRequest'
    | 'RepositoryVulnerabilityAlert'
    | 'Release'
    | 'TeamDiscussion'

export type NotificationReason
  = | 'approval_requested'
    | 'assign'
    | 'author'
    | 'comment'
    | 'ci_activity'
    | 'invitation'
    | 'manual'
    | 'member_feature_requested'
    | 'mention'
    | 'push'
    | 'review_requested'
    | 'security_advisory_credit'
    | 'security_alert'
    | 'state_change'
    | 'subscribed'
    | 'team_mention'
    | 'your_activity'

export type Thread = {
  id: string
  repository: MinimalRepository
  subject: {
    title: string
    url: string | null
    latest_comment_url: string | null
    type: NotificationSubject
    [k: string]: unknown
  }
  reason: NotificationReason
  unread: boolean
  updated_at: string
  last_read_at: string | null
  url: string
  subscription_url: string
  [k: string]: unknown
}

export type MinimalRepository = {
  id: number
  node_id: string
  name: string
  full_name: string
  owner: SimpleUser
  private: boolean
  html_url: string
  description: string | null
  fork: boolean
  url: string
  archive_url: string
  assignees_url: string
  blobs_url: string
  branches_url: string
  collaborators_url: string
  comments_url: string
  commits_url: string
  compare_url: string
  contents_url: string
  contributors_url: string
  deployments_url: string
  downloads_url: string
  events_url: string
  forks_url: string
  git_commits_url: string
  git_refs_url: string
  git_tags_url: string
  git_url?: string
  issue_comment_url: string
  issue_events_url: string
  issues_url: string
  keys_url: string
  labels_url: string
  languages_url: string
  merges_url: string
  milestones_url: string
  notifications_url: string
  pulls_url: string
  releases_url: string
  ssh_url?: string
  stargazers_url: string
  statuses_url: string
  subscribers_url: string
  subscription_url: string
  tags_url: string
  teams_url: string
  trees_url: string
  clone_url?: string
  mirror_url?: string | null
  hooks_url: string
  svn_url?: string
  homepage?: string | null
  language?: string | null
  forks_count?: number
  stargazers_count?: number
  watchers_count?: number
  /**
   * The size of the repository, in kilobytes. Size is calculated hourly. When a repository is initially created, the size is 0.
   */
  size?: number
  default_branch?: string
  open_issues_count?: number
  is_template?: boolean
  topics?: string[]
  has_issues?: boolean
  has_projects?: boolean
  has_wiki?: boolean
  has_pages?: boolean
  has_discussions?: boolean
  has_pull_requests?: boolean
  /**
   * The policy controlling who can create pull requests: all or collaborators_only.
   */
  pull_request_creation_policy?: 'all' | 'collaborators_only'
  archived?: boolean
  disabled?: boolean
  visibility?: string
  pushed_at?: string | null
  created_at?: string | null
  updated_at?: string | null
  permissions?: {
    admin?: boolean
    maintain?: boolean
    push?: boolean
    triage?: boolean
    pull?: boolean
    [k: string]: unknown
  }
  role_name?: string
  temp_clone_token?: string
  delete_branch_on_merge?: boolean
  subscribers_count?: number
  network_count?: number
  code_of_conduct?: CodeOfConduct
  license?: {
    key?: string
    name?: string
    spdx_id?: string
    url?: string | null
    node_id?: string
    [k: string]: unknown
  } | null
  forks?: number
  open_issues?: number
  watchers?: number
  allow_forking?: boolean
  web_commit_signoff_required?: boolean
  security_and_analysis?: {
    /**
     * Enable or disable GitHub Advanced Security for the repository.
     *
     * For standalone Code Scanning or Secret Protection products, this parameter cannot be used.
     *
     */
    advanced_security?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    code_security?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    /**
     * Enable or disable Dependabot security updates for the repository.
     */
    dependabot_security_updates?: {
      /**
       * The enablement status of Dependabot security updates for the repository.
       */
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    secret_scanning?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    secret_scanning_push_protection?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    secret_scanning_non_provider_patterns?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    secret_scanning_ai_detection?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    secret_scanning_delegated_alert_dismissal?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    secret_scanning_delegated_bypass?: {
      status?: 'enabled' | 'disabled'
      [k: string]: unknown
    }
    secret_scanning_delegated_bypass_options?: {
      /**
       * The bypass reviewers for secret scanning delegated bypass
       */
      reviewers?: {
        /**
         * The ID of the team or role selected as a bypass reviewer
         */
        reviewer_id: number
        /**
         * The type of the bypass reviewer
         */
        reviewer_type: 'TEAM' | 'ROLE'
        /**
         * The bypass mode for the reviewer
         */
        mode?: 'ALWAYS' | 'EXEMPT'
        [k: string]: unknown
      }[]
      [k: string]: unknown
    }
    [k: string]: unknown
  } | null
  /**
   * The custom properties that were defined for the repository. The keys are the custom property names, and the values are the corresponding custom property values.
   */
  custom_properties?: {
    [k: string]: unknown
  }
  [k: string]: unknown
}

export type SimpleUser = {
  name?: string | null
  email?: string | null
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string | null
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
  starred_at?: string
  user_view_type?: string
  [k: string]: unknown
}

export type CodeOfConduct = {
  key: string
  name: string
  url: string
  body?: string
  html_url: string | null
  [k: string]: unknown
}

export type AccessToken = {
  access_token: string
  expires_in: number
  refresh_token: string
  refresh_token_expires_in: number
  scope: string
  token_type: string
}
