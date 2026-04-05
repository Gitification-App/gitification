<script lang="ts" setup>
import type { Gitification } from '../../gitification'
import { computed } from 'vue'

type Props = {
  activeAccount: Gitification.Types.Api.AnyUser
  otherAccounts: Gitification.Types.Api.AnyUser[]
}

const props = defineProps<Props>()

defineEmits<{
  switchAccount: [user: Gitification.Types.Api.AnyUser]
  addAccount: []
}>()

const list = computed(() => [
  props.activeAccount,
  ...props.otherAccounts,
])
</script>

<template>
  <div class="w-full max-w-[300px]">
    <div class="flex flex-col">
      <div
        v-for="account of list"
        :key="account.id"
        class="flex flex-row justify-start gap-3 rounded-lg p-3"
        :class="{
          'bg-surface-2': account.id === activeAccount.id,
        }"
      >
        <img
          :src="account.avatar_url"
          alt="Avatar"
          class="w-10 h-10 rounded-full object-cover"
        >
        <div class="flex flex-col">
          <span class="text-txt-1 text-sm">{{ account.name }}</span>
          <span class="text-xs text-txt-2">{{ account.login }}</span>
        </div>
      </div>
    </div>

    <button
      class="mt-4 w-full flex items-center justify-center gap-2 p-2 border rounded hover:bg-gray-100"
      @click="$emit('addAccount')"
    >
      <span class="text-lg">+</span> Add Account
    </button>
  </div>
</template>
