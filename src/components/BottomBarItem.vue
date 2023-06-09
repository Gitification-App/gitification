<script lang="ts" setup>
import { platform } from '@tauri-apps/api/os'
import { useKey } from '../composables/useKey'
import { Icons } from './Icons'

interface Props {
  hotkey: string
  text: string
  withCommand: boolean
}

interface Emits {
  (e: 'select'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const os = await platform()

const shortcut = props.withCommand
  ? `${os === 'darwin' ? 'command' : 'ctrl'}+${props.hotkey}`
  : props.hotkey

const CommandKey = os === 'win32'
  ? Icons.Command
  : () => 'CTRL'

useKey(shortcut, () => {
  emit('select')
}, { prevent: true, repeat: false })
</script>

<template>
  <div
    class="bottom-bar-item"
    role="button"
    @click="emit('select')"
  >
    <div class="bottom-bar-item-content">
      {{ text }}
    </div>
    <span
      v-if="withCommand"
      class="bottom-bar-item-shortcut"
    >
      <CommandKey />
    </span>
    <span class="bottom-bar-item-shortcut">
      {{ hotkey.toUpperCase() }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.bottom-bar-item {
  height: 30px;
  padding: 5px;
  border-radius: 8px;
  color: var(--white);
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: var(--item-hover-bg);
  }

  &-content {
    margin-right: 5px;
    font-size: 12px;

    :deep(.icon) {
      vertical-align: middle;
      font-size: 18px;
    }
  }

  &-shortcut {
    + .bottom-bar-item-shortcut {
      margin-left: 2px;
    }
    font-size: 10px;
    min-width: 20px;
    display: inline-flex;
    height: 100%;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0px 3px;
    vertical-align: middle;
    background-color: var(--item-bg);
    border-radius: 6px;
    color: var(--white);
  }
}
</style>
