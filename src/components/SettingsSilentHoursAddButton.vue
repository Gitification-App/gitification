<script lang="ts" setup>
import { Icons } from './Icons'
import SlotRef from './SlotRef.vue'
import Tooltip from './Tooltip.vue'
</script>

<template>
  <SlotRef>
    <template #default>
      <button class="settings-silent-hours-add-button">
        <Icons.Plus16 />
      </button>
    </template>

    <template #ref="{ el }">
      <Tooltip
        text="Create new silent hour"
        :target="el"
      />
    </template>
  </SlotRef>
</template>

<style lang="scss" scoped>
.settings-silent-hours-add-button {
  width: 100%;
  background-color: var(--item-bg);
  padding: 10px;
  font-size: 16px;
  border-radius: 8px;
  color: var(--text);

  &:hover {
    background-color: var(--item-hover-bg);
  }
}
</style>
