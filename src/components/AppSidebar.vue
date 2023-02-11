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
    <div
      :class="{ 'nav-loading-indicator-active': store.loadingNotifications }"
      class="nav-loading-indicator"
    />

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
        :disabled="store.currentPage !== Page.Home"
        title="Reload notifications"
        @click="store.fetchNotifications(true)"
      >
        <Icons.Sync16 />
      </SidebarButton>

      <SidebarButton
        :disabled="store.currentPage === Page.Settings"
        title="Go to settings"
        @click="store.setPage(Page.Settings)"
      >
        <Icons.Gear16 />
      </SidebarButton>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
@keyframes nav-loading-indicator {
  0% {
    transform: translateY(-200px);
  }
  100% {
    transform: translateY(600px);
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
  position: relative;
  overflow: hidden;

  &-loading-indicator {
    position: absolute;
    right: 0;
    width: 2px;
    height: 200px;
    top: 0;
    background: radial-gradient(circle, rgba(150,150,150) 0%, rgba(255,255,255,0) 100%);
    visibility: hidden;

    &-active {
      visibility: visible;
      animation: 1s nav-loading-indicator linear infinite;
    }
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
