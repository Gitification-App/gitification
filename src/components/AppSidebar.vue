<script lang="ts" setup>
import { useRouteStore } from '../stores/routeStore'
import { Icons } from './Shared'
import SidebarButton from './SidebarButton.vue'

const routeStore = useRouteStore()
</script>

<template>
  <nav class="nav">
    <div class="upper">
      <SidebarButton @click="routeStore.goToHome">
        <Icons.Home />
      </SidebarButton>
    </div>
    <div class="lower">
      <SidebarButton @click="routeStore.goToSettings">
        <Icons.Sync />
      </SidebarButton>

      <SidebarButton @click="routeStore.goToSettings">
        <Icons.Gear />
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
