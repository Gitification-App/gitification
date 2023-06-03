<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { exit } from '@tauri-apps/api/process'
import { computed } from 'vue'
import { type ItemRenderList } from 'vue-selectable-items'
import { Page, REPO_LINK, REPO_RELEASES_LINK } from '../constants'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'
import { Icons } from './Icons'
import SidebarButton from './SidebarButton.vue'
import Popover from './Popover.vue'
import MenuItemsVue, { menuItem } from './MenuItems.vue'

const store = useStore()

function openCurrentReleaseChangelog() {
  open(`${REPO_LINK}/blob/main/CHANGELOG.md#${__APP_VERSION__.replace(/\./g, '')}`)
}

const moreItems = computed(() => [
  menuItem({
    key: 'changelog',
    meta: { text: 'Changelog', icon: Icons.BellSlash },
    onSelect: openCurrentReleaseChangelog,
  }),
  menuItem({
    key: 'settings',
    meta: { text: 'Settings', icon: Icons.Gear16 },
    onSelect: () => store.setPage(Page.Settings),
  }),
  AppStorage.get('user') != null && menuItem({
    key: 'logout',
    meta: { text: 'Log out', icon: Icons.SignOut16 },
    onSelect: store.logout,
  }),
  menuItem({
    key: 'exit',
    meta: { text: 'Exit app', icon: Icons.X },
    onSelect: () => exit(0),
  }),
] as ItemRenderList)
</script>

<template>
  <nav class="nav">
    <div class="upper">
      <button
        class="nav-logo"
        @click="open(REPO_LINK)"
      >
        <img
          title="Go to Gitification repository"
          draggable="false"
          src="/src/assets/img/icon.png"
        >
      </button>
    </div>
    <div class="lower">
      <SidebarButton
        v-if="store.newRelease != null"
        highlight
        title="An update is available"
        @click="open(`${REPO_RELEASES_LINK}/tag/${store.newRelease!.tag_name}`)"
      >
        <Icons.Download16 />
      </SidebarButton>

      <SidebarButton
        :disabled="store.currentPage !== Page.Home"
        title="Reload notifications"
        @click="store.fetchNotifications(true)"
      >
        <Icons.Sync16 />
      </SidebarButton>

      <!-- <SidebarButton
        :disabled="store.currentPage === Page.Settings"
        title="Go to settings"
        @click="store.setPage(Page.Settings)"
      >
        <Icons.Gear16 />
      </SidebarButton> -->

      <Popover
        :wowerlay-options="{
          position: 'right-end',
          noBackground: true,
          style: 'display: flex; flex-direction: column: flex-wrap: nowrap: gap: 5px; padding: 5px;',
        }"
      >
        <template #default>
          <SidebarButton title="More">
            <Icons.More />
          </SidebarButton>
        </template>

        <template #content>
          <MenuItemsVue :items="moreItems" />
        </template>
      </Popover>
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
  padding: 20px 10px;
  background-color: var(--sidebar-bg);
  position: relative;
  overflow: hidden;

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

.nav-logo {
  opacity: .8;
  @include focus-visible;
  border:1px solid black;
  border-radius: 50%;
  width: 30px;
  height: 30px;

  img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
  }

  &:hover,
  &:active {
    opacity: 1;
  }
}
</style>
