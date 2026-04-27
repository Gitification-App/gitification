<script lang="ts" setup>
import { computed, onMounted } from 'vue'
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

async function handleThreadClick(thread: Gitification.api.Types.Thread) {
  if (Gitification.state.currentUser == null) {
    return
  }

  const data = await Gitification.utils.github.createThreadHtmlURL({
    thread,
    user: Gitification.state.currentUser,
  })

  console.log(data)
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
      class="space-y-4"
    >
      <div
        v-for="[repoId, repoThreads] of groupedThreads"
        :key="repoId"
        class="space-y-2"
      >
        <UI.Repository
          :threads="repoThreads"
          :repo="repoThreads[0].repository"
        />
        <UI.Thread
          v-for="thread in repoThreads"
          :key="thread.id"
          :thread="thread"
          @click="handleThreadClick(thread)"
        />
      </div>
    </UI.PageContent>
  </UI.Page>
</template>
