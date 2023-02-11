<script lang="ts">
import type { Option } from '../types'
import { type IconComponent } from './Icons'
import PageHeader from './PageHeader.vue'

export enum EmptyStateIconSize {
  Regular,
  Big,
}
</script>

<script lang="ts" setup>
interface Props {
  icon?: Option<IconComponent>
  description: string
  iconSize?: Option<EmptyStateIconSize>
}
withDefaults(defineProps<Props>(), {
  iconSize: EmptyStateIconSize.Regular,
})
</script>

<template>
  <div class="empty-state">
    <div
      v-if="icon != null || $slots.icon != null"
      class="empty-state-icon-wrapper"
    >
      <slot name="icon">
        <Component
          :is="icon"
          v-if="icon != null"
          class="empty-state-icon"
          :class="{ 'empty-state-icon-big': iconSize === EmptyStateIconSize.Big }"
        />
      </slot>
    </div>

    <PageHeader>
      {{ description }}
    </PageHeader>

    <div class="empty-state-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  padding: 25px;
  align-items: center;
  justify-content: center;

  &-footer {
    width: 100%;
    text-align: center;
    margin-top: 15px;
  }

  &-icon {
    font-size: 30px;
    color: var(--white);

    &-wrapper {
      margin-bottom: 15px
    }

    &-big {
      font-size: 50px;
    }
  }
}
</style>
