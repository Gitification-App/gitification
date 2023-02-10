<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { Page, REPO_LINK } from '../constants'
import { useStore } from '../stores/store'
import { Icons } from './Icons'
import SidebarButton from './SidebarButton.vue'

const store = useStore()
</script>

<template>
  <nav class="nav">
    <div class="upper">
      <SidebarButton
        title="Go to Gitification repository"
        @click="open(REPO_LINK)"
      >
        <img
          style="width: 100%"
          draggable="false"
          src="/src/assets/img/icon.png"
        >
      </SidebarButton>
    </div>
    <div class="lower">
      <SidebarButton
        v-if="store.currentPage === Page.Home"
        title="Reload notifications"
        @click="store.fetchNotifications(true)"
      >
        <Icons.Sync16 :class="{ 'sync-icon-spin': store.loadingNotifications }" />
      </SidebarButton>

      <SidebarButton
        title="Go to settings"
        @click="store.setPage(Page.Settings)"
      >
        <Icons.Gear16 />
      </SidebarButton>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.nav {
  height: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  padding: 20px 10px;
  background-color: var(--sidebar-bg);

  .sync-icon-spin {
    animation: 1s spin linear infinite;
  }

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
