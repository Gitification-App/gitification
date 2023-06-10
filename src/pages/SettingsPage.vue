<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { disable as disableAutostart, enable as enableAutostart } from 'tauri-plugin-autostart-api'
import { computedEager, watchDebounced } from '@vueuse/core'

import { invoke } from '@tauri-apps/api/tauri'
import { requestPermission } from '@tauri-apps/api/notification'
import { confirm } from '@tauri-apps/api/dialog'
import AppButton from '../components/AppButton.vue'
import PageHeader from '../components/PageHeader.vue'
import { useStore } from '../stores/store'
import { AppStorage } from '../storage'
import { ColorPreference, InvokeCommand, Page } from '../constants'
import { Icons } from '../components/Icons'
import { useKey } from '../composables/useKey'
import { useTauriEvent } from '../composables/useTauriEvent'
import Separator from '../components/Separator.vue'
import Tooltip from '../components/Tooltip.vue'
import SlotRef from '../components/SlotRef.vue'
import MenuItems, { menuItem } from '../components/MenuItems.vue'
import Popover from '../components/Popover.vue'
import Switch from '../components/Switch.vue'
import SettingItem from '../components/SettingItem.vue'

const store = useStore()

const initialValues = {
  showOnlyParticipating: AppStorage.get('showOnlyParticipating'),
  showReadNotifications: AppStorage.get('showReadNotifications'),
}

const soundsEnabled = AppStorage.asRef('soundsEnabled')
const openAtStartup = AppStorage.asRef('openAtStartup')
const showOnlyParticipating = AppStorage.asRef('showOnlyParticipating')
const showReadNotifications = AppStorage.asRef('showReadNotifications')
const markAsReadOnOpen = AppStorage.asRef('markAsReadOnOpen')

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

const selectedColorText = computedEager(() => {
  switch (AppStorage.get('colorPreference')) {
    case ColorPreference.System:
      return 'System'
    case ColorPreference.Light:
      return 'Light'
    case ColorPreference.Dark:
      return 'Dark'
  }
})

const selectColorItems = computed(() => [
  menuItem({
    key: ColorPreference.System,
    meta: {
      text: 'System',
      selected: AppStorage.get('colorPreference') === ColorPreference.System,
    },
    onSelect() {
      AppStorage.set('colorPreference', ColorPreference.System)
    },
  }),
  menuItem({
    key: ColorPreference.Light,
    meta: {
      text: 'Light',
      selected: AppStorage.get('colorPreference') === ColorPreference.Light,
    },
    onSelect() {
      AppStorage.set('colorPreference', ColorPreference.Light)
    },
  }),
  menuItem({
    key: ColorPreference.Dark,
    meta: {
      text: 'Dark',
      selected: AppStorage.get('colorPreference') === ColorPreference.Dark,
    },
    onSelect() {
      AppStorage.set('colorPreference', ColorPreference.Dark)
    },
  }),
])

const scrollTop = ref(0)
function handleScroll(e: Event) {
  scrollTop.value = (e.target as HTMLElement).scrollTop
}
</script>

<template>
  <div
    class="settings"
    @scroll="handleScroll"
  >
    <div
      class="settings-header"
      :class="{ 'settings-header-with-border': scrollTop > 0 }"
    >
      <SlotRef>
        <template #default>
          <AppButton
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
      <PageHeader
        dot
        style="margin-bottom: 20px;"
      >
        Appearance
      </PageHeader>

      <SettingItem title="Theme">
        <SlotRef>
          <template #default>
            <AppButton>
              {{ selectedColorText }}

              <template #icon>
                <Icons.ChevronDown />
              </template>
            </AppButton>
          </template>

          <template #ref="{ el }">
            <Popover
              :target="el"
              :wowerlayOptions="{ position: 'bottom-end' }"
            >
              <MenuItems :items="selectColorItems" />
            </Popover>
          </template>
        </SlotRef>
      </SettingItem>

      <PageHeader
        dot
        style="margin: 20px 0px;"
      >
        System
      </PageHeader>

      <SettingItem title="Sounds">
        <Switch v-model="soundsEnabled" />
      </SettingItem>

      <Separator style="margin: 2px auto" />

      <SettingItem title="Open at startup">
        <Switch v-model="openAtStartup" />
      </SettingItem>

      <Separator style="margin: 2px auto" />

      <SettingItem title="Show system notifications">
        <Switch
          :modelValue="showSystemNotifications"
          @update:modelValue="handleUpdateShowSystemNotifications($event)"
        />
      </SettingItem>

      <PageHeader
        dot
        style="margin: 20px 0px;"
      >
        Notifications
      </PageHeader>

      <SettingItem title="Show only participating">
        <Switch v-model="showOnlyParticipating" />
      </SettingItem>

      <Separator style="margin: 2px auto" />

      <SettingItem title="Show read notifications">
        <Switch v-model="showReadNotifications" />
      </SettingItem>

      <Separator style="margin: 2px auto" />

      <SettingItem
        title="Mark as read on open"
        description="When you open some notifications, Github marks them as read automatically, but for some it doesn't."
      >
        <Switch v-model="markAsReadOnOpen" />
      </SettingItem>
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
    display: flex;
    flex-flow: column nowrap;

    &-header {
      z-index: 10;
      position: sticky;
      position: -webkit-sticky;
      top: 0;
      padding: 20px 25px;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      transition: box-shadow 0.2s ease-in-out;

      @supports not ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
        background-color: var(--content-bg);
      }

      &-with-border {
        box-shadow: 0px 3px 8px -5px rgba(0, 0, 0, 0.3);
      }

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
  }
</style>
