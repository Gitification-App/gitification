<script lang="ts" setup>
import { onScopeDispose, ref, watch } from 'vue'
import { exit } from '@tauri-apps/api/process'
import { invoke } from '@tauri-apps/api/tauri'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import SettingsItem from '../components/SettingsItem.vue'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'

const store = useStore()

const soundsEnabled = AppStorage.asRef('soundsEnabled')
const openAtStartup = AppStorage.asRef('openAtStartup')
const markAsReadOnClick = AppStorage.asRef('markAsReadOnClick')
const showOnlyParticipating = AppStorage.asRef('showOnlyParticipating')

watch(soundsEnabled, (enabled) => {
  if (enabled)
    invoke('play_notification_sound')
})
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
        v-model:enabled="openAtStartup"
        title="Open at startup"
      />

      <SettingsItem
        v-model:enabled="markAsReadOnClick"
        title="Mark as read on click"
      />

      <SettingsItem
        v-model:enabled="showOnlyParticipating"
        title="Show only participating"
      />
    </div>

    <div class="settings-footer">
      <AppButton @click="store.logout">
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
      grid-template-columns: 115px 115px 115px;
      grid-template-rows: 75px 75px;
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
