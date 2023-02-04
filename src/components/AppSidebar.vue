<script lang="ts" setup>
import { Page } from '../constants'
import { useStore } from '../stores/store'
import { Icons } from './Icons'
import SidebarButton from './SidebarButton.vue'

const store = useStore()
</script>

<template>
  <nav class="nav">
    <div class="upper">
      <SidebarButton @click="store.currentPage = Page.Home">
        <Icons.Bell />
      </SidebarButton>
    </div>
    <div class="lower">
      <SidebarButton>
        <Icons.Sync />
      </SidebarButton>

      <SidebarButton @click="store.currentPage = Page.Settings">
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
