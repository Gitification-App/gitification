<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, onScopeDispose } from 'vue'
import { useKey } from '../composables/useKey'
import { useTauriEvent } from '../composables/useTauriEvent'
import * as Gitification from '../gitification/index'
import * as UI from '../ui'

const groupedThreads = computed(() => (
  Object.entries(
    Gitification.utils.object.groupBy(
      Gitification.state.threads,
      // By default js orders object keys, so we avoid it by prefix and suffix
      (thread) => `::${thread.repository.id}::`,
    ),
  )
))

onMounted(() => {
  Gitification.actions.fetchThreads(Gitification.state.threads.length === 0)
})

useKey('esc', () => {
  Gitification.state.checkedThreadIds.clear()
})

useKey('cmd+a,ctrl+a', () => {
  for (const thread of Gitification.state.threads) {
    Gitification.state.checkedThreadIds.add(thread.id)
  }
}, { prevent: true, disabledOverlay: true })

useTauriEvent('window:hidden', () => {
  Gitification.state.checkedThreadIds.clear()
})

onScopeDispose(() => {
  Gitification.state.checkedThreadIds.clear()
})

// Click empty space to clear selection
useEventListener(
  () => document.querySelector('#app') as HTMLElement,
  'mousedown',
  (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) {
      return
    }

    const target = e.target as HTMLElement

    if (target.closest('button')) {
      return
    }

    Gitification.state.checkedThreadIds.clear()
  },
)

function handleRepoClick(event: MouseEvent | null, repo: Gitification.api.Types.MinimalRepository, threads: Gitification.api.Types.Thread[]) {
  if (event?.ctrlKey || event?.metaKey) {
    for (const thread of threads) {
      Gitification.actions.selectThread(thread)
    }

    return
  }

  Gitification.actions.openURL(`https://github.com/${repo.full_name}`)
}

async function handleThreadClick(event: MouseEvent | null, thread: Gitification.api.Types.Thread) {
  if (event?.ctrlKey || event?.metaKey || event?.shiftKey) {
    Gitification.actions.toggleThreadSelection(thread)
    return
  }

  if (Gitification.state.currentUser == null) {
    return
  }

  if (event) {
    Gitification.actions.clearThreadSelection()
  }

  const data = await Gitification.utils.github.createThreadHtmlURL({
    thread,
    user: Gitification.state.currentUser,
  })

  if (data == null) {
    return
  }

  Gitification.actions.openURL(data)
  Gitification.actions.markThreadAsRead(thread)
}

function getThreadContextMenuItems(thread: Gitification.api.Types.Thread) {
  type Item = ReturnType<InstanceType<typeof UI.ContextMenu>['getItems']>[number]

  if (!Gitification.state.checkedThreadIds.has(thread.id)) {
    Gitification.actions.clearThreadSelection()
    Gitification.actions.selectThread(thread)
  }

  const items: Item[] = [
    {
      text: 'Open',
      action: () => {
        for (const checkedThread of Gitification.state.checkedThreads) {
          handleThreadClick(null, checkedThread)
        }
      },
      icon: UI.Icons.LinkSquare01,
    },
    {
      text: 'Mark as Read',
      action: () => {
        for (const checkedThread of Gitification.state.checkedThreads) {
          Gitification.actions.markThreadAsRead(checkedThread)
        }
      },
      icon: UI.Icons.TickDouble04,
    },
    {
      text: 'Unsubscribe',
      action: () => void 0,
      icon: UI.Icons.NotificationOff01,
    },
  ]
    .map((item, index) => ({
      ...item,
      hotkey: String(index + 1),
    }))

  return items
}

function getRepoContextMenuItems(repo: Gitification.api.Types.MinimalRepository) {
  type Item = ReturnType<InstanceType<typeof UI.ContextMenu>['getItems']>[number]

  Gitification.actions.clearThreadSelection()

  return ([
    {
      text: 'Select all notifications',
      action: () => {
        for (const thread of Gitification.state.threads) {
          if (thread.repository.id === repo.id) {
            Gitification.actions.selectThread(thread)
          }
        }
      },
      icon: UI.Icons.CheckmarkCircle01,
    },
    {
      text: 'Open repository',
      action: () => {
        Gitification.actions.openURL(`https://github.com/${repo.full_name}`)
      },
      icon: UI.Icons.LinkSquare01,
    },
  ] as Item[])
    .map((item, index) => ({
      ...item,
      hotkey: String(index + 1),
    }))
}
</script>

<template>
  <UI.Page>
    <UI.ActionSection
      v-if="Gitification.state.threadLoadStatus === 'loading'"
      class="m-auto w-4/6"
    >
      <template #label>
        <UI.Icons.Loading03 class="animate-spin" />
      </template>

      <template #heading>
        Loading...
      </template>

      <template #description>
        Fetching threads from github.
      </template>
    </UI.ActionSection>

    <UI.ActionSection
      v-else-if="Gitification.state.threadLoadStatus === 'failed'"
      class="m-auto w-4/6"
    >
      <template #label>
        <UI.Icons.Alert01 />
      </template>

      <template #heading>
        Network Error
      </template>

      <template #description>
        Couldn't fetch threads from github.
      </template>

      <template #action>
        <UI.Button
          class="mt-2"
          variant="light"
          paddingVariant="sm"
        >
          Retry
        </UI.Button>
      </template>
    </UI.ActionSection>

    <UI.ActionSection
      v-else-if="Gitification.state.threads.length === 0"
      class="m-auto w-4/6"
    >
      <template #label>
        <UI.Icons.Tick01 />
      </template>

      <template #heading>
        It's quiet here...
      </template>

      <template #description>
        No threads to show.
      </template>

      <template #action>
        <UI.Button
          class="mt-2"
          variant="light"
          paddingVariant="sm"
          @click="Gitification.actions.fetchThreads(true)"
        >
          Refetch
        </UI.Button>
      </template>
    </UI.ActionSection>

    <UI.PageContent
      v-else
      class="flex flex-col gap-y-4"
    >
      <div
        v-for="[repoId, repoThreads] of groupedThreads"
        :key="repoId"
        class="flex flex-col gap-y-2"
      >
        <UI.ContextMenu :getItems="() => getRepoContextMenuItems(repoThreads[0].repository)">
          <UI.Repository
            :threads="repoThreads"
            :repo="repoThreads[0].repository"
            @click="handleRepoClick($event, repoThreads[0].repository, repoThreads)"
          />
        </UI.ContextMenu>

        <UI.ContextMenu
          v-for="thread in repoThreads"
          :key="thread.id"
          :getItems="() => getThreadContextMenuItems(thread)"
        >
          <UI.Thread
            :thread="thread"
            :checked="Gitification.state.checkedThreadIds.has(thread.id)"
            @click="handleThreadClick($event, thread)"
          />
        </UI.ContextMenu>
      </div>
    </UI.PageContent>
  </UI.Page>
</template>
