<script setup lang="ts">
import type { MinimalRepository } from '../../gitification/api/types'

defineProps<{
  repo: MinimalRepository
}>()
</script>

<template>
  <button
    class="sticky top-0 z-[5] rounded-xl w-full bg-surface-1/50 backdrop-blur-[8px] hover:bg-surface-3 py-2 px-2  flex flex-row justify-start text-left items-center gap-2"
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

    <span class="text-txt-1 text-[14px] font-[500] w-full truncate min-w-0">
      {{ repo.full_name }}
    </span>
  </button>
</template>
