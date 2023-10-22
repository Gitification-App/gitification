<script lang="ts" setup>
import { Icons } from './Icons'
import SlotRef from './SlotRef.vue'
import Tooltip from './Tooltip.vue'

interface Props {
  inline?: boolean
  dot?: boolean
  info?: string
}

withDefaults(defineProps<Props>(), {
  inline: false,
})
</script>

<template>
  <header
    class="header"
    :class="{ 'header-inline': inline }"
  >
    <div
      v-if="dot"
      class="header-dot"
    />

    <slot />

    <SlotRef v-if="info != null">
      <template #default>
        <div class="header-info">
          <Icons.Question />
        </div>
      </template>

      <template #ref="{ el }">
        <Tooltip
          style="width: 275px; text-align: left"
          :text="info"
          :target="el"
          position="top"
        />
      </template>
    </SlotRef>
  </header>
</template>

<style lang="scss" scoped>
.header {
  font-size: 16px;
  color: var(--text);
  white-space: nowrap;
  display: flex;
  align-items: center;
  font-weight: bold;

  &-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: currentColor;
    margin-right: 8px;
  }

  &-inline {
    display: inline-block;
  }

  &-info {
    margin-left: 5px;
    color: var(--accent-color);
    font-size: 14px;
    vertical-align: middle;
    display: inline-flex;
  }
}
</style>
