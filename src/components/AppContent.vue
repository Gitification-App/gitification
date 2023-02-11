<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useStore } from '../stores/store'
import type { Option } from '../types'

const store = useStore()
const mainEl = ref<Option<HTMLElement>>(null)

watch(() => store.currentPage, () => {
  mainEl.value?.focus()
}, { flush: 'post' })
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
