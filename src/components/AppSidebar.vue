<script lang="ts" setup>
import { exit } from '@tauri-apps/api/process'
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
</script>

<template>
  <nav class="nav">
    <div class="upper">
      <SidebarButton
        :disabled="store.currentPage !== Page.Settings"
        @click="handleBack"
      >
        <Icons.ChevronLeft />
      </SidebarButton>
    </div>
    <div class="lower">
      <SidebarButton
        v-if="accessToken != null"
        @click="store.fetchNotifications(true)"
      >
        <Icons.Sync16 />
      </SidebarButton>

      <SidebarButton @click="store.setPage(Page.Settings)">
        <Icons.Gear16 />
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
