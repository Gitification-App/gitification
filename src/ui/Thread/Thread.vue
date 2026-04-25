<script setup lang="ts">
import type { Thread } from '../../gitification/api/types'
import { computed } from 'vue'
import { useI18n } from '../../composables/useI18n'
import * as Gitification from '../../gitification/index'
import { fromNow } from '../../utils/date'
import * as UI from '../index'

type Props = {
  thread: Thread
}

const props = defineProps<Props>()

const ThreadIcon = computed(() => {
  switch (props.thread.subject.type) {
    case 'Issue': {
      return UI.Icons.IssueOpened24
    }
    case 'PullRequest': {
      return UI.Icons.GitPullRequest
    }
    case 'CheckSuite': {
      return UI.Icons.Reload
    }
    case 'Commit': {
      return UI.Icons.GitCommit
    }
    case 'Discussion': {
      return UI.Icons.Comment01
    }
    case 'Release': {
      return UI.Icons.Tag01
    }
    case 'RepositoryVulnerabilityAlert': {
      return UI.Icons.Alert01
    }
    case 'RepositoryInvitation': {
      return UI.Icons.MailAccount02
    }
    case 'TeamDiscussion': {
      return UI.Icons.MessageUser02
    }
    default: {
      return UI.Icons.Cancel01
    }
  }
})

const { t, currentLanguage } = useI18n()

const reason = computed(() => {
  switch (props.thread.reason) {
    case 'assign': {
      return t.reason.assign
    }
    case 'author': {
      return t.reason.author
    }
    case 'comment': {
      return t.reason.comment
    }
    case 'invitation': {
      return t.reason.invitation
    }
    case 'manual': {
      return t.reason.manual
    }
    case 'mention': {
      return t.reason.mention
    }
    case 'state_change': {
      return t.reason.state_change
    }
    case 'subscribed': {
      return t.reason.subscribed
    }
    case 'team_mention': {
      return t.reason.team_mention
    }
    case 'approval_requested': {
      return t.reason.approval_requested
    }
    case 'ci_activity': {
      return t.reason.ci_activity
    }
    case 'member_feature_requested': {
      return t.reason.member_feature_requested
    }
    case 'review_requested': {
      return t.reason.review_requested
    }
    case 'push': {
      return t.reason.push
    }
    case 'security_advisory_credit': {
      return t.reason.security_advisory_credit
    }
    case 'security_alert': {
      return t.reason.security_alert
    }
    case 'your_activity': {
      return t.reason.your_activity
    }
    default: {
      return props.thread.reason
    }
  }
})
</script>

<template>
  <button
    class="flex flex-row relative gap-3 w-full items-center rounded-xl min-w-0 flex-nowrap p-3 ring ring-surface-3 bg-surface-2 hover:bg-surface-3"
    type="button"
  >
    <ThreadIcon class="text-[16px] text-txt-3 shrink-0" />

    <div class="text-left w-full items-start flex flex-col gap-1 flex-nowrap min-w-0">
      <h2 class="shrink text-txt-1 text-[14px] font-[450] w-full truncate min-w-0">
        {{ thread.subject.title }}
      </h2>

      <p class="text-txt-2 text-[12px] font-[400] truncate w-full">
        {{ reason }}
        -
        <span>{{
          Gitification.utils.date
            .fromNow(currentLanguage, thread.updated_at)
        }}</span>
      </p>
    </div>
  </button>
</template>
