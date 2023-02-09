<script lang="ts" setup>
import { exit } from '@tauri-apps/api/process'
import { Page } from '../constants'
import { useStore } from '../stores/store'
import { Icons } from './Icons'
import SidebarButton from './SidebarButton.vue'

const store = useStore()
</script>

<template>
  <nav class="nav">
    <div
      v-if="store.currentPage !== Page.Landing"
      class="upper"
    >
      <SidebarButton @click="store.setPage(Page.Home)">
        <Icons.Bell16 />
      </SidebarButton>
    </div>
    <div class="lower">
      <template v-if="store.currentPage !== Page.Landing">
        <SidebarButton @click="store.fetchNotifications(true)">
          <Icons.Sync16 />
        </SidebarButton>

        <SidebarButton @click="store.setPage(Page.Settings)">
          <Icons.Gear16 />
        </SidebarButton>
      </template>

      <SidebarButton
        v-else
        @click="exit(0)"
      >
        <Icons.SignOut16 />
      </SidebarButton>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.nav {
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 10px;
  background-color: var(--sidebar-bg);

  .upper,
  .lower {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
  }

  .upper {
    margin-bottom: auto;
  }

  .lower {
    margin-top: auto;
  }

}
</style>
