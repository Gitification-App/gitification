<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { exit } from '@tauri-apps/api/process'
import { computed } from 'vue'
import { REPO_LINK } from '../constants'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'
import { useKey } from '../composables/useKey'
import { Page, useRoute } from '../stores/route'
import { Icons } from './Icons'
import SidebarButton from './SidebarButton.vue'
import Popover from './Popover.vue'
import MenuItems, { menuItem } from './MenuItems.vue'
import Tooltip from './Tooltip.vue'
import SlotRef from './SlotRef.vue'
import PopoverContentInstallUpdate from './PopoverContentInstallUpdate.vue'

const store = useStore()
const route = useRoute()

function openCurrentReleaseChangelog() {
  open(`${REPO_LINK}/blob/main/CHANGELOG.md#${__APP_VERSION__.replace(/\./g, '')}`)
}

const moreItems = computed(() => [
  menuItem({
    key: 'changelog',
    meta: { text: 'Changelog', icon: Icons.Info16 },
    onSelect: openCurrentReleaseChangelog,
  }),
  menuItem({
    key: 'settings',
    meta: { text: 'Settings', icon: Icons.Gear16 },
    onSelect: () => route.go(Page.Settings),
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
])

useKey('r', () => {
  store.fetchNotifications(true)
}, { source: () => route.currentPage === Page.Home })
</script>

<template>
  <nav class="nav">
    <div class="upper">
      <SlotRef>
        <template #default>
          <button
            class="nav-logo"
            @click="open(REPO_LINK)"
          >
            <img
              draggable="false"
              src="/src/assets/img/icon.png"
            >
          </button>
        </template>

        <template #ref="{ el }">
          <Tooltip
            :target="el"
            position="right"
            text="Navigate to repository"
          />
        </template>
      </SlotRef>
    </div>

    <div class="lower">
      <SlotRef v-if="store.newRelease != null">
        <template #default>
          <SidebarButton highlight>
            <Icons.Download16 />
          </SidebarButton>
        </template>

        <template #ref="{ el }">
          <Tooltip
            :target="el"
            position="right"
            text="A new version is available"
          />

          <Popover
            :target="el"
            :wowerlayOptions="{ position: 'right-end' }"
          >
            <PopoverContentInstallUpdate
              :loading="store.installingUpate"
              :manifest="store.newRelease"
              @install="store.updateAndRestart()"
            />
          </Popover>
        </template>
      </SlotRef>

      <SlotRef>
        <template #default>
          <SidebarButton
            :disabled="route.currentPage !== Page.Home"
            @click="store.fetchNotifications(true)"
          >
            <Icons.Sync16 />
          </SidebarButton>
        </template>

        <template #ref="{ el }">
          <Tooltip
            :target="el"
            position="right"
            text="Reload notifications (R)"
          />
        </template>
      </SlotRef>

      <SlotRef>
        <template #default>
          <SidebarButton>
            <Icons.More />
          </SidebarButton>
        </template>

        <template #ref="{ el }">
          <Tooltip
            position="right"
            :target="el"
            text="More"
          />

          <Popover
            :target="el"
            :wowerlayOptions="{ position: 'right-end' }"
          >
            <MenuItems :items="moreItems" />
          </Popover>
        </template>
      </SlotRef>
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
  border-radius: 50%;
  width: 30px;
  height: 30px;
  overflow: hidden;

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
