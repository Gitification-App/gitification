<script lang="tsx" setup>
import { computed } from 'vue'
import * as Gitification from '../../gitification/index'
import * as UI from '../index'
import { menuItem } from '../MenuItems/MenuItems.vue'

const otherUsers = computed(() => (
  Gitification.state.users
    .filter(({ user }) => user.id !== Gitification.state.currentUser?.user.id)
))

const items = computed(() => {
  const accountItems = [Gitification.state.currentUser!, ...otherUsers.value]
    .sort(({ user: a }, { user: b }) => a.login.localeCompare(b.login))
    .map(({ user }, index) => menuItem({
      key: String(user.id),
      onSelect() {
        Gitification.actions.switchAccount(user.id)
      },
      meta: {
        text: user.login,
        selected: user.id === Gitification.state.currentUser?.user.id,
        key: String(index + 1),
        icon: (
          <img
            src={user.avatar_url}
            alt={`${user.login}'s avatar`}
            class="size-[18px] rounded-full"
          />
        ),
      },
    }))

  return [
    ...accountItems,
    menuItem({
      key: 'add-account',
      onSelect: () => Gitification.router.navigate('addAccount'),
      meta: {
        text: 'Add Account',
        icon: UI.Icons.UserAdd01,
        key: 'n',
      },
    }),
  ]
})
</script>

<template>
  <UI.MenuItems :items="items" />
</template>
