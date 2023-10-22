<script lang="ts" setup>
import { Icons } from './Icons'
import SlotRef from './SlotRef.vue'
import Tooltip from './Tooltip.vue'

interface Props {
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="setting-item">
    <div class="setting-item-title">
      {{ title }}

      <SlotRef v-if="typeof description === 'string' && description.trim().length > 0">
        <template #default>
          <div class="setting-item-title-description">
            <Icons.Question />
          </div>
        </template>

        <template #ref="{ el }">
          <Tooltip
            style="width: 275px; text-align: left"
            :text="description"
            :target="el"
            position="top"
          />
        </template>
      </SlotRef>
    </div>
    <div class="setting-item-right">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .setting-item {
    display: flex;
    flex-direction: row;
    min-height: 40px;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;

    &-title,
    &-right {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-title {
      color: var(--text);
      font-size: 14px;
      padding-left: 15px;
      position: relative;
      display: inline-flex;
      align-items: center;

      &-description {
        display: inline-flex;
        margin-left: 5px;
        color: var(--accent-color);
      }
    }

    &-right {
      margin-left: 10px;
    }
  }
</style>
