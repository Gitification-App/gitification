<script lang="ts" setup>
import * as Gitification from '../gitification'
import * as UI from '../ui'
</script>

<template>
  <UI.Page>
    <UI.PageHeader @back="Gitification.router.navigate('home')">
      Settings
    </UI.PageHeader>

    <UI.PageContent class="grid place-items-center">
      SettingsViews
    </UI.PageContent>
  </UI.Page>
</template>
