<script lang="ts">
export const SilentHourDays = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
}

export interface SilentHourContext {
  repoName: string
  start: string
  end: string
  days: number[]
}

interface Props {
  context?: SilentHourContext[]
}

const mockListData = [
  {
    repoName: 'test',
    start: '10:00',
    end: '12:00',
    days: [SilentHourDays.Monday, SilentHourDays.Tuesday],
  },
  {
    repoName: 'test2',
    start: '10:00',
    end: '12:00',
    days: [SilentHourDays.Monday, SilentHourDays.Tuesday],
  },
]
</script>

<script lang="ts" setup>
import { ref } from 'vue'
import Dialog from './Dialog.vue'
import PageHeader from './PageHeader.vue'
import SettingsSilentHoursAddButton from './SettingsSilentHoursAddButton.vue'
import SettingsSilentHoursItem from './SettingsSilentHoursItem.vue'

withDefaults(defineProps<Props>(), {
  context: () => [],
})

const dialogVisible = ref(false)
</script>

<template>
  <PageHeader
    dot
    style="margin: 20px 0px;"
    info="You can select specific hours not to receive any system notification and not to play sound for a spesific repository."
  >
    Silent Hours
  </PageHeader>

  <SettingsSilentHoursItem
    v-for="item in mockListData"
    :key="item.repoName"
    :context="item"
  />

  <SettingsSilentHoursAddButton @click="dialogVisible = true" />

  <Dialog
    v-model:visible="dialogVisible"
    title="Add Silent Hour"
  >
    Bruh
  </Dialog>
</template>
