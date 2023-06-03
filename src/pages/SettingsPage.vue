<script lang="ts" setup>
import { watch } from 'vue'
import { disable as disableAutostart, enable as enableAutostart } from 'tauri-plugin-autostart-api'
import { watchDebounced } from '@vueuse/core'

import { invoke } from '@tauri-apps/api/tauri'
import { requestPermission } from '@tauri-apps/api/notification'
import { confirm } from '@tauri-apps/api/dialog'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import SettingsItem from '../components/SettingsItem.vue'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'
import { InvokeCommand, Page } from '../constants'
import { Icons } from '../components/Icons'
import { useKey } from '../composables/useKey'
import { useTauriEvent } from '../composables/useTauriEvent'

const store = useStore()

const initialValues = {
  showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
  showReadNotifications: AppStorage.get('showReadNotifications'),
}

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

useTauriEvent('window:hidden', () => {
  setTimeout(() => store.setPage(Page.Home), 50)
})

function handleBack() {
  if (accessToken.value == null)
    return store.setPage(Page.Landing)

  store.setPage(Page.Home, {
    fetchOnEnter: (
      initialValues.showOnlyParticipating !== showOnlyParticipating.value
      || initialValues.showReadNotifications !== showReadNotifications.value
    ),
  })
}

useKey('esc', handleBack, { prevent: true })

const showSystemNotifications = AppStorage.asRef('showSystemNotifications')
async function handleUpdateShowSystemNotifications(value: boolean) {
  if (!value) {
    showSystemNotifications.value = false
    return
  }

  const permission = await requestPermission()

  if (permission !== 'granted') {
    const confirmed = await confirm('Gitification has no permission to show notifications. Press Ok to go to Preferences/Notifications.', {
      type: 'error',
    })

    if (confirmed)
      invoke(InvokeCommand.GoToNotificationSettings)

    return
  }

  showSystemNotifications.value = value
}
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
      <SettingsItem
        :enabled="showSystemNotifications"
        title="Show system notifications"
        @update:enabled="handleUpdateShowSystemNotifications"
      />
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
    padding: 20px 45px;
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
  }
</style>
