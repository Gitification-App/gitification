<script lang="ts" setup>
import { computed, h } from 'vue'
import { UI } from '..'
import MenuItems, { menuItem } from '../../components/MenuItems.vue'
import { Gitification } from '../../gitification'

const currentUser = computed(() => Gitification.storage.get('user')!)

const otherUsers = computed(() => (
  Gitification.storage.get('allUsers')
    .filter((user) => user.id !== currentUser.value?.id)
))

const items = computed(() => {
  const accountItems = [currentUser.value, ...otherUsers.value]
    .map((user, index) => menuItem({
      key: String(user.id),
      meta: {
        key: index > 0 ? String(index + 1) : undefined,
        text: user.login,
        selected: user.id === currentUser.value?.id,
        icon: h('img', {
          src: user.avatar_url,
          alt: `${user.login}'s avatar`,
          class: 'size-[18px] rounded-full',
        }),
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
      },
    }),
  ]
})
</script>

<template>
  <MenuItems :items="items" />
</template>
