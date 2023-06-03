<script lang="ts" setup>
import { ref, watch } from 'vue'
import { disable as disableAutostart, enable as enableAutostart } from 'tauri-plugin-autostart-api'
import { watchDebounced } from '@vueuse/core'

import { invoke } from '@tauri-apps/api/tauri'
import { requestPermission } from '@tauri-apps/api/notification'
import { confirm } from '@tauri-apps/api/dialog'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'
import { InvokeCommand, Page } from '../constants'
import { Icons } from '../components/Icons'
import { useKey } from '../composables/useKey'
import { useTauriEvent } from '../composables/useTauriEvent'
import Separator from '../components/Separator.vue'
import Tooltip from '../components/Tooltip.vue'
import { useElementNavigation } from '../composables/useElementNavigation'
import SlotRef from '../components/SlotRef.vue'

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

interface ISettingsItem {
  title: string
  valueGetter: () => boolean
  onToggle: () => void
}

const items: ISettingsItem[] = [
  {
    title: 'Sounds',
    valueGetter: () => soundsEnabled.value,
    onToggle: () => soundsEnabled.value = !soundsEnabled.value,
  },
  {
    title: 'Open at startup',
    valueGetter: () => openAtStartup.value,
    onToggle: () => openAtStartup.value = !openAtStartup.value,
  },
  {
    title: 'Show only participating',
    valueGetter: () => showOnlyParticipating.value,
    onToggle: () => showOnlyParticipating.value = !showOnlyParticipating.value,
  },
  {
    title: 'Show read notifications',
    valueGetter: () => showReadNotifications.value,
    onToggle: () => showReadNotifications.value = !showReadNotifications.value,
  },
  {
    title: 'Show system notifications',
    valueGetter: () => showSystemNotifications.value,
    onToggle() {
      handleUpdateShowSystemNotifications(!showSystemNotifications.value)
    },
  },
]

const container = ref<HTMLElement | null>(null)
useElementNavigation({
  target: container,
  targetQuery: '.settings-item',
  navigateNextHotkey: 'down',
  navigatePreviousHotkey: 'up',
})
</script>

<template>
  <div
    ref="container"
    class="settings"
  >
    <div class="settings-header">
      <SlotRef>
        <template #default>
          <AppButton
            ghost
            class="settings-header-back-button"
            square
            @click="handleBack"
          >
            <Icons.ChevronLeft />
          </AppButton>
        </template>

        <template #ref="{ el }">
          <Tooltip
            text="Go Back (ESC)"
            :target="el"
          />
        </template>
      </SlotRef>

      <PageHeader inline>
        Settings
      </PageHeader>
    </div>

    <div class="settings-grid">
      <template
        v-for="(item, index) of items"
        :key="index"
      >
        <button
          class="settings-item"
          :class="{ 'settings-item-active': item.valueGetter() }"
          @click="item.onToggle()"
        >
          <div class="settings-item-title">
            {{ item.title }}
          </div>
          <div
            class="settings-item-switch"
          >
            <Icons.Check16 />
          </div>
        </button>

        <Separator
          v-if="index !== items.length - 1"
          style="margin: 2px auto"
        />
      </template>
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
    display: flex;
    flex-flow: column nowrap;

    &-header {
      margin: 20px 35px 0px 35px;

      &-back-button {
        margin-right: 10px;
        border-radius: 8px;
      }
    }

    &-grid {
      padding: 20px 30px;
      display: grid;
      gap: 5px;
    }

    &-item {
      @include focus-visible();
      display: flex;
      flex-direction: row;
      height: 40px;
      justify-content: space-between;
      align-items: center;
      border-radius: 8px;
      padding: 10px;
      color: var(--white-faded);

      &-active {
        color: var(--white);

        .settings-item-switch {
          color: var(--accent-color);
          opacity: 1;
        }
      }

      &:hover {
        background-color: var(--item-hover-bg);
      }

      &-title,
      &-switch {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      &-title {
        color: currentColor;
        font-size: 14px;
      }

      &-switch {
        margin-left: 10px;
        font-size: 16px;
        color: var(--white-faded);
        opacity: .2;
      }
    }
  }
</style>
