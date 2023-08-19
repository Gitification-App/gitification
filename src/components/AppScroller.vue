<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { type OverlayScrollbarsComponentRef, OverlayScrollbarsComponent as ScrollView } from 'overlayscrollbars-vue'
import { type PartialOptions as OverlayScrollbarsOptions } from 'overlayscrollbars'
import { computedEager } from '@vueuse/core'
import { useTauriEvent } from '../composables/useTauriEvent'
import { useStore } from '../stores/store'
import type { Option } from '../types'
import { batchFn } from '../utils/batch'
import { ColorPreference } from '../constants'
import { useRoute } from '../stores/route'

const store = useStore()
const route = useRoute()
const scrollView = ref<Option<OverlayScrollbarsComponentRef>>(null)

const focus = batchFn(() => {
  scrollView.value?.getElement()?.focus()
})

watch(() => route.currentPage, focus, { flush: 'post' })
useTauriEvent('window:hidden', focus)
onMounted(focus)

watch(() => route.currentPage, () => {
  const element = scrollView.value?.osInstance()?.elements().scrollOffsetElement
  if (element)
    element.scrollTop = 0
}, { flush: 'post' })

const options = computedEager<OverlayScrollbarsOptions>(() => ({
  scrollbars: {
    autoHide: 'scroll',
    theme: store.theme === ColorPreference.Dark ? 'os-theme-light' : 'os-theme-dark',
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
    :class="{
      'main-with-padding': route.meta.withPadding,
    }"
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
  scroll-padding: 10px 10px;

  &-with-padding {
    padding: 10px;
  }
}
</style>
