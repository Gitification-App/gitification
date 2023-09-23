<script lang="ts" setup>
import type { UpdateManifest } from '@tauri-apps/api/updater'
import { useI18n } from '../composables/useI18n'
import AppButton from './AppButton.vue'
import EmptyState from './EmptyState.vue'

interface Props {
  manifest: UpdateManifest
  loading?: boolean
}

defineProps<Props>()
defineEmits<{ (e: 'install'): void }>()

const { t } = useI18n()
const appVersion = __APP_VERSION__
</script>

<template>
  <div class="install-update">
    <EmptyState :description="t.gitificationVersionIsAvailable(manifest.version)">
      <template #icon>
        <img
          style="border-radius: 50%;"
          width="50"
          draggable="false"
          height="50"
          src="/src/assets/img/icon.png"
        >
      </template>

      <template #footer>
        <p class="pharagraph">
          <component :is="t.currentVersionIs(appVersion)" />
        </p>

        <AppButton
          :loading="loading"
          @click="$emit('install')"
        >
          {{ t.install }}
        </AppButton>
      </template>
    </EmptyState>
  </div>
</template>

<style lang="scss" scoped>
.install-update {
  .pharagraph {
    color: var(--text-faded);
    font-size: 12px;
    margin-bottom: 15px;
  }
}

:deep(.header) {
  font-size: 16px;
}

.empty-state {
  padding: 15px;

  :deep(.empty-state-footer) {
    margin-top: 5px
  }
}
</style>
