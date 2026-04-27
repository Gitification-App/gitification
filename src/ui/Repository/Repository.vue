<script setup lang="ts">
import type { MinimalRepository } from '../../gitification/api/types'
import type * as Gitification from '../../gitification/index'

defineProps<{
  repo: MinimalRepository
  threads: Gitification.api.Types.Thread[]
}>()
</script>

<template>
  <button
    class="with-attention sticky top-0 z-[5] rounded-xl w-full bg-surface-1/50 backdrop-blur-[8px] hover:bg-surface-3 py-2 px-2  flex flex-row justify-start text-left items-center gap-2"
    type="button"
  >
    <img
      draggable="false"
      class="size-6 rounded-lg bg-surface-6"
      width="24"
      height="24"
      :src="repo.owner.avatar_url"
      alt="repo logo"
    >

    <span class="text-txt-3 text-[14px] font-[500] max-w-full truncate min-w-0">
      {{ repo.full_name }}
    </span>

    <span class="text-txt-3 text-xs">({{ threads.length }})</span>
  </button>
</template>
