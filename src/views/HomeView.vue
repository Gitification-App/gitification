<script lang="ts" setup>
import { computed } from 'vue'
import * as Gitification from '../gitification/index'
import * as UI from '../ui'

const threads = Gitification.mock.createThreads()

const groupedThreads = computed(() => (
  Object.entries(
    Gitification.utils.object.groupBy(
      threads,
      (thread) => thread.repository.id,
    ),
  )
))
</script>

<template>
  <UI.Page>
    <UI.PageContent class="space-y-4">
      <div
        v-for="[repoId, repoThreads] of groupedThreads"
        :key="repoId"
        class="space-y-2"
      >
        <UI.Repository :repo="repoThreads[0].repository" />
        <UI.Thread
          v-for="thread in repoThreads"
          :key="thread.id"
          :thread="thread"
        />
      </div>
      <div
        v-for="[repoId, repoThreads] of groupedThreads"
        :key="repoId"
        class="space-y-2"
      >
        <UI.Repository :repo="repoThreads[0].repository" />
        <UI.Thread
          v-for="thread in repoThreads"
          :key="thread.id"
          :thread="thread"
        />
      </div>
    </UI.PageContent>
  </UI.Page>
</template>
