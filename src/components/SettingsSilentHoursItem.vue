<script lang="ts">
import AppButton from './AppButton.vue'
import { Icons } from './Icons'
import { type SilentHourContext } from './SettingsSilentHours.vue'

interface Props {
  context: SilentHourContext
}
</script>

<script lang="ts" setup>
defineProps<Props>()
</script>

<template>
  <div class="silent-hours-item">
    <div class="silent-hours-repo-name">
      {{ context.repoName }}
    </div>
    <div class="silent-hours-time-text">
      {{ context.start }} - {{ context.end }}
    </div>
    <div class="silent-hours-buttons">
      <AppButton
        square
        ghost
      >
        <template #icon>
          <Icons.Command />
        </template>
      </AppButton>

      <AppButton
        square
        ghost
      >
        <template #icon>
          <Icons.Pencil />
        </template>
      </AppButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.silent-hours {

  &-item {
    display: flex;
    flex-flow: row  nowrap;
    width: 100%;
    align-items: center;

    > * + * {
      margin-left: 5px;
    }
  }

  &-repo-name {
    width: 100%;
    flex-shrink: 1;
    flex-grow: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 14px;
    color: var(--text);
  }

  &-time-text {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--accent-color);
  }

  &-buttons {
    flex-shrink: 0;
  }
}
</style>
