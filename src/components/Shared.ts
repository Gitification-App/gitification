import { markRaw } from 'vue'

import MoreIcon from 'virtual:icons/octicon/kebab-horizontal-24'
import GearIcon from 'virtual:icons/octicon/gear-24'
import HomeIcon from 'virtual:icons/octicon/home-24'
import SyncIcon from 'virtual:icons/octicon/sync-24'
import PullRequestIcon from 'virtual:icons/octicon/git-pull-request-24'

export const Icons = {
  More: markRaw(MoreIcon),
  Gear: markRaw(GearIcon),
  Home: markRaw(HomeIcon),
  Sync: markRaw(SyncIcon),
  PullRequest: markRaw(PullRequestIcon),
}
