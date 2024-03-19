<script lang="ts" setup>
import { open } from '@tauri-apps/api/shell'
import { exit } from '@tauri-apps/api/process'
import { computed, ref } from 'vue'
import { REPO_LINK } from '../constants'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'
import { useKey } from '../composables/useKey'
import { useI18n } from '../composables/useI18n'
import { Page, useRoute } from '../composables/useRoute'
import { useCommonCalls } from '../composables/useCommonCalls'
import { Icons } from './Icons'
import SidebarButton from './SidebarButton.vue'
import Popover from './Popover.vue'
import MenuItems, { menuItem } from './MenuItems.vue'
import Tooltip from './Tooltip.vue'
import SlotRef from './SlotRef.vue'
import PopoverContentInstallUpdate from './PopoverContentInstallUpdate.vue'

const store = useStore()
const route = useRoute()
const { t } = useI18n()

function openCurrentReleaseChangelog() {
  open(`${REPO_LINK}/blob/main/CHANGELOG.md#${__APP_VERSION__.replace(/\./g, '')}`)
}

const moreItems = computed(() => [
  menuItem({
    key: 'changelog',
    meta: { text: t.changelog, icon: Icons.Info16 },
    onSelect: openCurrentReleaseChangelog,
  }),
  menuItem({
    key: 'settings',
    meta: { text: t.settings, icon: Icons.Gear16 },
    onSelect: () => route.go(Page.Settings),
  }),
  AppStorage.get('user') != null && menuItem({
    key: 'logout',
    meta: { text: t.logOut, icon: Icons.SignOut16 },
    onSelect: store.logout,
  }),
  menuItem({
    key: 'exit',
    meta: { text: t.exitApp, icon: Icons.X },
    onSelect: () => exit(0),
  }),
])

const commonCalls = useCommonCalls()

useKey('r', () => {
  commonCalls.fetchThreads(true)
}, { source: () => route.currentPage.value === Page.Home })

const morePopover = ref<InstanceType<typeof Popover> | null>(null)

useKey('.', () => {
  morePopover.value?.show()
})
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
            :text="t.navigateToRepository"
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
            :text="t.aNewVersionIsAvailable"
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
            :disabled="route.currentPage.value !== Page.Home"
            @click="commonCalls.fetchThreads(true)"
          >
            <Icons.Sync16 />
          </SidebarButton>
        </template>

        <template #ref="{ el }">
          <Tooltip
            :target="el"
            position="right"
            :text="t.reloadNotifications('R')"
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
            :text="t.more"
          />

          <Popover
            ref="morePopover"
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
