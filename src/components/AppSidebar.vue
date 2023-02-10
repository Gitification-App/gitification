<script lang="ts" setup>
import { exit } from '@tauri-apps/api/process'
import { useKey } from '../composables/useKey'
import { Page } from '../constants'
import { AppStorage } from '../storage'
import { useStore } from '../stores/store'
import { Icons } from './Icons'
import SidebarButton from './SidebarButton.vue'

const store = useStore()

const accessToken = AppStorage.asComputed('accessToken')

function handleBack() {
  let page = Page.Home

  if (accessToken.value == null)
    page = Page.Landing

  store.setPage(page)
}

useKey('esc', handleBack, { source: () => store.currentPage === Page.Settings })
</script>

<template>
  <nav class="nav">
    <div class="upper">
      <SidebarButton
        title="Back to home page"
        :disabled="store.currentPage !== Page.Settings"
        @click="handleBack"
      >
        <Icons.ChevronLeft />
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
  padding: 10px;
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
