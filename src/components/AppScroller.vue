<script lang="ts" setup>
import { computed, onMounted, provide, ref, watch } from 'vue'
import { type OverlayScrollbarsComponentRef, OverlayScrollbarsComponent as ScrollView } from 'overlayscrollbars-vue'
import type { PartialOptions as OverlayScrollbarsOptions } from 'overlayscrollbars'
import { computedEager } from '@vueuse/core'
import { useTauriEvent } from '../composables/useTauriEvent'
import { useStore } from '../stores/store'
import type { Option } from '../types'
import { batchFn } from '../utils/batch'
import { ColorPreference } from '../constants'
import { useTheme } from '../composables/useTheme'
import { useRoute } from '../composables/useRoute'
import { scrollElementInjectionKey } from '../composables/useScrollElement'

const route = useRoute()
const scrollView = ref<Option<OverlayScrollbarsComponentRef>>(null)

const focus = batchFn(() => {
  scrollView.value?.getElement()?.focus()
})

provide(scrollElementInjectionKey, computed(() => scrollView.value?.osInstance()?.elements()?.viewport as HTMLElement))

useTauriEvent('window:hidden', focus)
onMounted(focus)
watch(route.currentPage, () => {
  focus()

  const element = scrollView.value?.osInstance()?.elements().scrollOffsetElement
  if (element) {
    element.scrollTop = 0
  }
}, { flush: 'post' })

const { theme } = useTheme()

const options = computedEager<OverlayScrollbarsOptions>(() => ({
  scrollbars: {
    autoHide: 'scroll',
    theme: theme.value === ColorPreference.Dark ? 'os-theme-light' : 'os-theme-dark',
  },
}))
</script>

<template>
  <ScrollView
    ref="scrollView"
    element="main"
    defer
    :options="options"
    tabindex="-1"
    class="main"
  >
    <slot />
  </ScrollView>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: var(--content-bg);
  position: relative;
  outline: none;

  :deep([data-overlayscrollbars-viewport]) {
    scroll-padding: 10px 10px;
  }

}
</style>
