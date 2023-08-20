import { markRaw } from 'vue'

import MoreIcon from 'virtual:icons/octicon/kebab-horizontal-24'
import GearIcon from 'virtual:icons/octicon/gear-24'
import GearIcon16 from 'virtual:icons/octicon/gear-16'
import HomeIcon from 'virtual:icons/octicon/home-24'
import SyncIcon from 'virtual:icons/octicon/sync-24'
import SyncIcon16 from 'virtual:icons/octicon/sync-16'
import MuteIcon from 'virtual:icons/octicon/mute-24'
import GithubIcon from 'virtual:icons/octicon/mark-github-16'
import UnmuteIcon from 'virtual:icons/octicon/unmute-24'
import PullRequestIcon from 'virtual:icons/octicon/git-pull-request-24'
import CheckIcon from 'virtual:icons/octicon/check-24'
import CheckIcon16 from 'virtual:icons/octicon/check-16'
import CheckFillIcon from 'virtual:icons/octicon/check-circle-16'
import XIcon from 'virtual:icons/octicon/x-16'
import BellIcon from 'virtual:icons/octicon/bell-24'
import BellIcon16 from 'virtual:icons/octicon/bell-16'
import CommitIcon from 'virtual:icons/octicon/git-commit-24'
import CommentDiscussionsIcon from 'virtual:icons/octicon/comment-discussion-24'
import IssueOpenedIcon from 'virtual:icons/octicon/issue-opened-24'
import TagIcon from 'virtual:icons/octicon/tag-24'
import AlertIcon from 'virtual:icons/octicon/alert-24'
import QuestionIcon from 'virtual:icons/octicon/question-24'
import InfoIcon16 from 'virtual:icons/octicon/info-16'
import MailIcon from 'virtual:icons/octicon/mail-24'
import SignOutIcon16 from 'virtual:icons/octicon/sign-out-16'
import ChevronLeftIcon from 'virtual:icons/octicon/chevron-left-24'
import ChevronDownIcon from 'virtual:icons/octicon/chevron-down-24'
import DownloadIcon16 from 'virtual:icons/octicon/download-16'
import BellSlashIcon from 'virtual:icons/octicon/bell-slash-24'
import BellSlashIcon16 from 'virtual:icons/octicon/bell-slash-16'
import MailIcon16 from 'virtual:icons/octicon/mail-16'
import LinkExternalIcon16 from 'virtual:icons/octicon/link-external-16'
import SquareIcon16 from 'virtual:icons/octicon/square-16'
import CircleIcon24 from 'virtual:icons/octicon/Circle-24'
import PlusIcon16 from 'virtual:icons/octicon/plus-16'
import DashIcon16 from 'virtual:icons/octicon/dash-16'

import CommandIcon from 'virtual:icons/ph/command'

export type IconComponent = typeof Icons[keyof typeof Icons]

export const Icons = {
  More: markRaw(MoreIcon),
  Gear: markRaw(GearIcon),
  Home: markRaw(HomeIcon),
  Sync: markRaw(SyncIcon),
  PullRequest: markRaw(PullRequestIcon),
  Mute: markRaw(MuteIcon),
  Unmute: markRaw(UnmuteIcon),
  Github: markRaw(GithubIcon),
  Check: markRaw(CheckIcon),
  X: markRaw(XIcon),
  CheckFill: markRaw(CheckFillIcon),
  Bell: markRaw(BellIcon),
  Commit: markRaw(CommitIcon),
  CommentDiscussions: markRaw(CommentDiscussionsIcon),
  IssueOpened: markRaw(IssueOpenedIcon),
  Tag: markRaw(TagIcon),
  Alert: markRaw(AlertIcon),
  Question: markRaw(QuestionIcon),
  Mail: markRaw(MailIcon),
  Mail16: markRaw(MailIcon16),
  SignOut16: markRaw(SignOutIcon16),
  Bell16: markRaw(BellIcon16),
  Gear16: markRaw(GearIcon16),
  Sync16: markRaw(SyncIcon16),
  ChevronLeft: markRaw(ChevronLeftIcon),
  Download16: markRaw(DownloadIcon16),
  Command: markRaw(CommandIcon),
  BellSlash: markRaw(BellSlashIcon),
  BellSlash16: markRaw(BellSlashIcon16),
  Info16: markRaw(InfoIcon16),
  Check16: markRaw(CheckIcon16),
  LinkExternal16: markRaw(LinkExternalIcon16),
  Square16: markRaw(SquareIcon16),
  Circle: markRaw(CircleIcon24),
  ChevronDown: markRaw(ChevronDownIcon),
  Plus16: markRaw(PlusIcon16),
  Dash16: markRaw(DashIcon16),
}
