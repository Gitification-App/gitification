<script lang="ts" setup>
import * as Gitification from '../gitification/index'
import * as UI from '../ui'
</script>

<template>
  <UI.Page>
    <UI.PageHeader @back="Gitification.router.navigate('home')">
      Settings
    </UI.PageHeader>

    <UI.PageContent class="space-y-3">
      <UI.SettingsGroup title="Appearence">
        <UI.SettingsItem title="Theme">
          <UI.PickGroup
            v-model="Gitification.state.settings.colorPreference"
            :values="['light', 'dark', 'system']"
          />
        </UI.SettingsItem>
      </UI.SettingsGroup>

      <UI.SettingsGroup title="System">
        <UI.SettingsItem title="Open at startup">
          <UI.PickGroup
            :modelValue="Gitification.state.settings.openAtStartup ? 'On' : 'Off'"
            :values="['On', 'Off']"
            @update:modelValue="async (value) => {
              Gitification.state.settings.openAtStartup = value === 'On'
              if (value === 'On') {
                Gitification.actions.AutoStart.enable()
                  .catch(() => {
                    Gitification.state.settings.openAtStartup = false
                  })
              }
              else {
                Gitification.actions.AutoStart.disable()
                  .catch(() => {
                    Gitification.state.settings.openAtStartup = true
                  })
              }
            }"
          />
        </UI.SettingsItem>

        <UI.SettingsItem title="Sounds">
          <UI.PickGroup
            :modelValue="Gitification.state.settings.soundsEnabled ? 'On' : 'Off'"
            :values="['On', 'Off']"
            @update:modelValue="(newValue) => {
              const enabled = newValue === 'On'
              Gitification.state.settings.soundsEnabled = enabled
              if (enabled) {
                Gitification.actions.playNotificationSound()
              }
            }"
          />
        </UI.SettingsItem>

        <UI.SettingsItem title="System notifications">
          <UI.PickGroup
            :modelValue="Gitification.state.settings.showSystemNotifications ? 'On' : 'Off'"
            :values="['On', 'Off']"
            @update:modelValue="async (value) => {
              Gitification.state.settings.showSystemNotifications = value === 'On'
              if (value === 'On') {
                const permission = await Gitification.actions.requestNotificationPermission()
                if (permission === 'denied') {
                  Gitification.state.settings.showSystemNotifications = false
                }
              }
            }"
          />
        </UI.SettingsItem>
      </UI.SettingsGroup>

      <UI.SettingsGroup title="Notifications">
        <UI.SettingsItem title="Show read notifications">
          <UI.PickGroup
            :modelValue="Gitification.state.settings.showReadNotifications ? 'On' : 'Off'"
            :values="['On', 'Off']"
            @update:modelValue="Gitification.state.settings.showReadNotifications = $event === 'On'"
          />
        </UI.SettingsItem>

        <UI.SettingsItem title="Only participating">
          <UI.PickGroup
            :modelValue="Gitification.state.settings.onlyParticipating ? 'On' : 'Off'"
            :values="['On', 'Off']"
            @update:modelValue="Gitification.state.settings.onlyParticipating = $event === 'On'"
          />
        </UI.SettingsItem>

        <UI.SettingsItem>
          <template #title>
            Poll interval

            <UI.Tooltip
              position="top-start"
              title="Gitification fetches notifications from GitHub at a regular interval. You can set the interval here."
            >
              <button className="text-[10px] align-top">
                <span class="font-mono inline-block px-1 text-primary">?</span>
              </button>
            </UI.Tooltip>
          </template>

          <UI.PickGroup
            v-model="Gitification.state.settings.pollInterval"
            :values="[30, 60, 90, 120]"
          />
        </UI.SettingsItem>
      </UI.SettingsGroup>

      <UI.SettingsGroup title="Accounts">
        <UI.SettingsItem
          v-for="{ user } in Gitification.state.users"
          :key="user.id"
        >
          <template #title>
            <div class="flex flex-row items-center gap-2">
              <img
                :src="user.avatar_url"
                class="rounded-full size-6"
              >

              <span class="text-txt-1 text-sm font-[400]">{{ user.login }}</span>
            </div>
          </template>

          <UI.Button
            variant="ghost"
            paddingVariant="md"
            @click="Gitification.actions.logout(user.id)"
          >
            <UI.Icons.Delete01 />
          </UI.Button>
        </UI.SettingsItem>
      </UI.SettingsGroup>

      <div class="flex flex-row justify-end gap-2 border-t py-6 border-t-surface-2">
        <UI.Tooltip
          position="top"
          title="Reset all settings to default values"
        >
          <UI.Button
            variant="secondary"
            paddingVariant="md"
            @click="Gitification.actions.resetSettings()"
          >
            <template #leftIcon>
              <UI.Icons.Reload />
            </template>
            Reset settings
          </UI.Button>
        </UI.Tooltip>

        <UI.Tooltip
          position="top-end"
          title="Quit application"
        >
          <UI.Button
            variant="danger"
            paddingVariant="md"
            @click="Gitification.actions.quitApp()"
          >
            <template #leftIcon>
              <UI.Icons.ShutDown />
            </template>
          </UI.Button>
        </UI.Tooltip>
      </div>
    </UI.PageContent>
  </UI.Page>
</template>
