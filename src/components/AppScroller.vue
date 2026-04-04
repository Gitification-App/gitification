<script lang="ts" setup>
import type { OverlayScrollbarsComponentRef } from 'overlayscrollbars-vue'
import type { Option } from '../types'
import { OverlayScrollbarsComponent as ScrollView } from 'overlayscrollbars-vue'
import { computed, onMounted, provide, ref, watch } from 'vue'

import { scrollElementInjectionKey } from '../composables/useScrollElement'
import { useTauriEvent } from '../composables/useTauriEvent'
import { useTheme } from '../composables/useTheme'
import { ColorPreference } from '../constants'
import { Gitification } from '../gitification'
import { batchFn } from '../utils/batch'

const scrollView = ref<Option<OverlayScrollbarsComponentRef>>(null)

const focus = batchFn(() => {
  scrollView.value?.getElement()?.focus()
})

const scrollElement = computed(() => scrollView.value?.osInstance()?.elements()?.scrollOffsetElement as HTMLElement)

provide(scrollElementInjectionKey, scrollElement)

useTauriEvent('window:hidden', focus)

onMounted(focus)

watch(Gitification.router.current, () => {
  focus()

  if (scrollElement.value) {
    scrollElement.value.scrollTop = 0
  }
}, { flush: 'post' })

const { theme } = useTheme()
</script>

<template>
  <ScrollView
    ref="scrollView"
    element="main"
    defer
    :options="{
      scrollbars: {
        autoHide: 'scroll',
        theme: theme === ColorPreference.Dark ? 'os-theme-light' : 'os-theme-dark',
      },
    }"
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
