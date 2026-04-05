<script lang="ts" setup>
import type { VNode } from 'vue'
import { UI } from '..'
import { ButtonVariantStyles, PaddingVariantStyles } from './Button.constants'

type ButtonProps = {
  variant: keyof typeof ButtonVariantStyles
  paddingVariant: keyof typeof PaddingVariantStyles
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
}

withDefaults(defineProps<ButtonProps>(), {
  type: 'button',
  disabled: false,
  loading: false,
})

const slots = defineSlots<{
  leftIcon?: () => VNode
  rightIcon?: () => VNode
  default: () => VNode
}>()

const iconWrapperStyles = 'text-[16px] shrink-0 inline-grid place-items-center'
</script>

<template>
  <button
    :type="type"
    class="relative rounded-lg whitespace-nowrap font-medium inline-flex flex-row text-center justify-center items-center gap-[8px]"
    :class="[
      ButtonVariantStyles[variant].bg,
      ButtonVariantStyles[variant].fg,
      ButtonVariantStyles[variant].shadow,
      PaddingVariantStyles[paddingVariant],
      {
        'cursor-not-allowed opacity-50': disabled || loading,
        '*:not-[.loading]:invisible': loading,
      },
    ]"
    :disabled="loading || disabled"
  >
    <div
      v-if="loading"
      class="aspect-square animate-spin loading absolute size-full grid place-items-center z-[5] left-0 right-0 top-0 bottom-0"
    >
      <UI.Icons.Loading03 class="text-[12px]" />
    </div>

    <span
      v-if="slots.leftIcon"
      :class="iconWrapperStyles"
    >
      <slot name="leftIcon" />
    </span>

    <span class="contents">
      <slot />
    </span>

    <span
      v-if="slots.rightIcon"
      :class="iconWrapperStyles"
    >
      <slot name="rightIcon" />
    </span>
  </button>
</template>
