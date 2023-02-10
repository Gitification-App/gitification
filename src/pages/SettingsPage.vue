<script lang="ts" setup>
import { watch } from 'vue'
import { exit } from '@tauri-apps/api/process'
import { invoke } from '@tauri-apps/api/tauri'
import { disable as disableAutostart, enable as enableAutostart } from 'tauri-plugin-autostart-api'
import { watchDebounced } from '@vueuse/core'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import SettingsItem from '../components/SettingsItem.vue'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'
import { InvokeCommand, Page } from '../constants'
import { Icons } from '../components/Icons'
import { useKey } from '../composables/useKey'

const store = useStore()

const soundsEnabled = AppStorage.asRef('soundsEnabled')
const openAtStartup = AppStorage.asRef('openAtStartup')
const showOnlyParticipating = AppStorage.asRef('showOnlyParticipating')
const showReadNotifications = AppStorage.asRef('showReadNotifications')

const accessToken = AppStorage.asComputed('accessToken')

watch(soundsEnabled, (enabled) => {
  if (enabled)
    invoke(InvokeCommand.PlayNotificationSound)
})

watchDebounced(openAtStartup, (enabled) => {
  if (enabled)
    enableAutostart()
  else
    disableAutostart()
}, { debounce: 350 })

function handleBack() {
  let page = Page.Home

  if (accessToken.value == null)
    page = Page.Landing

  store.setPage(page)
}

useKey('esc', handleBack, { prevent: true })
</script>

<template>
  <div class="settings">
    <div class="settings-header">
      <AppButton
        class="settings-header-back-button"
        square
        title="Go back"
        @click="handleBack"
      >
        <Icons.ChevronLeft />
      </AppButton>

      <PageHeader inline>
        Settings
      </PageHeader>
    </div>

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
        v-model:enabled="showOnlyParticipating"
        title="Show only participating"
      />
      <SettingsItem
        v-model:enabled="showReadNotifications"
        title="Show read notifications"
      />
    </div>

    <div class="settings-footer">
      <AppButton
        v-if="accessToken"
        @click="store.logout"
      >
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
    outline: none;
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

      &-back-button {
        margin-right: 10px;
      }
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
        margin-left: 5px;
      }
    }
  }
</style>
