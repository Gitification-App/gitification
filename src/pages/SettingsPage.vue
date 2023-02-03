<script lang="ts" setup>
import { ref } from 'vue'
import { exit } from '@tauri-apps/api/process'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import SettingsItem from '../components/SettingsItem.vue'
import { Icons } from '../components/Shared'
import { Page } from '../constants'
import { useRouteStore } from '../stores/routeStore'

const routeStore = useRouteStore()

const soundsEnabled = ref(true)
const autoStartEnabled = ref(true)
</script>

<template>
  <div class="settings">
    <PageHeader class="settings-header">
      Settings
    </PageHeader>

    <div class="settings-grid">
      <SettingsItem
        v-model:enabled="soundsEnabled"
        title="Sounds"
      />

      <SettingsItem
        v-model:enabled="autoStartEnabled"
        title="Open at startup"
      />

      <div class="settings-grid-item" />
      <div class="settings-grid-item" />
      <div class="settings-grid-item" />
      <div class="settings-grid-item" />
      <div class="settings-grid-item" />
      <div class="settings-grid-item" />
      <div class="settings-grid-item" />
    </div>

    <div class="settings-footer">
      <AppButton @click="routeStore.currentPage = Page.Landing">
        Log out
      </AppButton>

      <AppButton @click="exit(0)">
        Exit App
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .settings {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 25px 45px;
    display: flex;
    flex-flow: column nowrap;

    &-header {
      margin-bottom: 25px;
    }

    &-grid {
      display: grid;
      grid-template-columns: 85px 85px 85px 85px;
      grid-template-rows: 85px 85px;
      grid-gap: 5px;
    }

    &-footer {
      margin-top: auto;
      display: flex;
      width: 100%;
      flex-direction: row nowrap;
      justify-content: flex-end;

      > .button + .button {
        margin-left: 10px;
      }
    }
  }
</style>
