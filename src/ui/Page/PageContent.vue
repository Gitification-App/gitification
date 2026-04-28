<script lang="ts" setup>
import { useTemplateRef } from 'vue'

const content = useTemplateRef('content')

document.addEventListener('focus', () => {
  if (content.value == null) {
    return
  }

  const el = content.value

  const x = el.scrollLeft
  const y = el.scrollTop

  requestAnimationFrame(() => {
    el.scrollTo(x, y)
    document.activeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  })
}, true)
</script>

<template>
  <div
    ref="content"
    class="page-content scroll-m-5 relative p-2 overflow-y-auto min-h-0 min-w-0 shrink h-full w-full"
  >
    <slot />
  </div>
</template>
