<script lang="ts" setup>
import * as Gitification from '../gitification/index'
import * as UI from '../ui'
</script>

<template>
  <UI.Page>
    <UI.PageHeader @back="Gitification.router.navigate('home')">
      Settings
    </UI.PageHeader>

    <UI.PageContent class="space-y-5 pb-20">
      <UI.SettingsGroup title="Appearence">
        <UI.SettingsItem title="Theme">
          <UI.PickGroup
            v-model="Gitification.state.settings.colorPreference"
            :values="['light', 'dark', 'system']"
          />
        </UI.SettingsItem>
      </UI.SettingsGroup>

      <UI.SettingsGroup title="System">
        <UI.SettingsItem title="Sounds">
          <UI.PickGroup
            :modelValue="Gitification.state.settings.soundsEnabled ? 'On' : 'Off'"
            :values="['On', 'Off']"
            @update:modelValue="Gitification.state.settings.soundsEnabled = $event === 'On'"
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
            <template #rightIcon>
              <UI.Icons.Logout05 />
            </template>
            Log out
          </UI.Button>
        </UI.SettingsItem>
      </UI.SettingsGroup>
    </UI.PageContent>
  </UI.Page>
</template>
