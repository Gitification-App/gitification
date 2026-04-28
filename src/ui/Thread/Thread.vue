<script setup lang="ts">
import type { Thread } from '../../gitification/api/types'
import { useElementVisibility } from '@vueuse/core'
import { computed, useTemplateRef } from 'vue'
import * as Gitification from '../../gitification/index'
import * as UI from '../index'

type Props = {
  thread: Thread
  checked?: boolean
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

const reason = computed(() => Gitification.i18n.reason[props.thread.reason])

const visible = useElementVisibility(useTemplateRef('el'), {
  initialValue: true,
})
</script>

<template>
  <button
    ref="el"
    class="with-attention thread isolate flex flex-row relative gap-3 w-full items-center rounded-xl min-w-0 flex-nowrap p-3 ring ring-surface-3 bg-surface-2 group"
    :class="{
      'bg-primary attention-active': checked,
      'not-focus-visible:scale-85': !visible,
      'scale-100': visible,
    }"
    type="button"
  >
    <div
      v-if="props.thread.unread"
      class="absolute ring-offset-primary ring-offset-3 w-[8px] h-[4px] right-[8px] top-[8px] bg-primary rounded-full"
    />

    <div
      class="invisible group-hover:visible bg-linear-45 from-surface-6 to-transparent size-full left-0 top-0 absolute -z-2 rounded-[inherit]"
    />

    <div
      v-if="checked"
      class="bg-linear-45 from-primary/30 to-transparent size-full left-0 top-0 absolute -z-1 rounded-[inherit]"
    />

    <ThreadIcon class="text-[16px] text-txt-3 shrink-0" />

    <div class="text-left w-full items-start flex flex-col gap-1 flex-nowrap min-w-0">
      <h2
        class="shrink text-[14px] font-[525] w-full truncate min-w-0"
        :class="[
          thread.unread ? 'text-txt-1' : 'text-txt-3',
        ]"
      >
        {{ thread.subject.title }}
      </h2>

      <p class="text-txt-2 text-[12px] font-[400] truncate w-full">
        {{ reason }}
        -
        <span>{{
          Gitification.utils.date
            .fromNow(thread.updated_at)
        }}</span>
      </p>
    </div>
  </button>
</template>
