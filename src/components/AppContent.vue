<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useTauriEvent } from '../composables/useTauriEvent'
import { useStore } from '../stores/store'
import type { Option } from '../types'
import { batchFn } from '../utils/batch'

const store = useStore()
const mainEl = ref<Option<HTMLElement>>(null)

const focus = batchFn(() => {
  mainEl.value?.focus()
})

watch(() => store.currentPage, focus, { flush: 'post' })
useTauriEvent('window:hidden', focus)
</script>

<template>
  <main
    ref="mainEl"
    tabindex="-1"
    class="main"
  >
    <slot />
  </main>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--content-bg);
  position: relative;
  outline: none;
}
</style>
