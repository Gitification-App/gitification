<script lang="ts" setup>
import { useEventListener } from '@vueuse/core'
import { computed, onMounted, onScopeDispose } from 'vue'
import { useKey } from '../composables/useKey'
import * as Gitification from '../gitification/index'
import * as UI from '../ui'

const groupedThreads = computed(() => (
  Object.entries(
    Gitification.utils.object.groupBy(
      Gitification.state.threads,
      // By default js orders object keys if they are number, so we avoid it by prefix and suffix
      (thread) => `::${thread.repository.id}::`,
    ),
  )
))

onMounted(() => {
  Gitification.actions.fetchThreads(Gitification.state.threads.length === 0)
})

function handleThreadCheckToggle(thread: Gitification.api.Types.Thread) {
  const set = Gitification.state.checkedThreadIds
  if (set.has(thread.id)) {
    set.delete(thread.id)
  }
  else {
    set.add(thread.id)
  }
}

function handleRepoClick(event: MouseEvent | null, repo: Gitification.api.Types.MinimalRepository, threads: Gitification.api.Types.Thread[]) {
  if (event?.ctrlKey || event?.metaKey) {
    for (const thread of threads) {
      Gitification.state.checkedThreadIds.add(thread.id)
    }

    return
  }

  Gitification.actions.openURL(`https://github.com/${repo.full_name}`)
}

async function handleThreadClick(event: MouseEvent | null, thread: Gitification.api.Types.Thread) {
  if (event?.ctrlKey || event?.metaKey) {
    handleThreadCheckToggle(thread)
    return
  }

  if (Gitification.state.currentUser == null) {
    return
  }

  const data = await Gitification.utils.github.createThreadHtmlURL({
    thread,
    user: Gitification.state.currentUser,
  })

  console.log(data)
}

useKey('esc', () => {
  Gitification.state.checkedThreadIds.clear()
})

onScopeDispose(() => {
  Gitification.state.checkedThreadIds.clear()
})

useEventListener(() => document.querySelector('#app') as HTMLElement, 'click', (e) => {
  if (e.ctrlKey || e.metaKey) {
    return
  }

  Gitification.state.checkedThreadIds.clear()
})

function getThreadContextMenuItems(thread: Gitification.api.Types.Thread) {
  type Item = InstanceType<typeof UI.ContextMenu>['items'][number]

  const items: Item[] = [
    {
      text: 'Select',
      hotkey: '1',
      action: () => void handleThreadCheckToggle(thread),
    },
    {
      text: 'Open',
      hotkey: '2',
      action: () => void handleThreadClick(null, thread),
    },
    {
      text: 'Mark as Read',
      hotkey: '3',
      action: () => void 0,
    },
    {
      text: 'Unsubscribe',
      hotkey: '4',
      action: () => void 0,
    },
  ]

  return items
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
        <UI.Repository
          :threads="repoThreads"
          :repo="repoThreads[0].repository"
          @click="handleRepoClick($event, repoThreads[0].repository, repoThreads)"
        />

        <UI.ContextMenu
          v-for="thread in repoThreads"
          :key="thread.id"
          :items="getThreadContextMenuItems(thread)"
        >
          <UI.Thread
            :thread="thread"
            :checked="Gitification.state.checkedThreadIds.has(thread.id)"
            @click="handleThreadClick($event, thread)"
            @contextmenu="() => {
              const unchecked = !Gitification.state.checkedThreadIds.has(thread.id)
              if (unchecked) {
                Gitification.state.checkedThreadIds.clear()
                Gitification.state.checkedThreadIds.add(thread.id)
              }
            }"
          />
        </UI.ContextMenu>
      </div>
    </UI.PageContent>
  </UI.Page>
</template>
