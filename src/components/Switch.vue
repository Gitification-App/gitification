<script lang="ts">
interface Props {
  modelValue: boolean
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
}
</script>

<script lang="ts" setup>
const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
})

const emit = defineEmits<Emits>()

function handleClick() {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    role="checkbox"
    :aria-checked="props.modelValue"
    class="switch"
    :class="{ active: props.modelValue }"
    @click="handleClick"
  >
    <div class="switch-dot" />
  </button>
</template>

<style lang="scss" scoped>
.switch {
  @include focus-visible;
  width: 26px;
  border-radius: 8px;
  height: 16px;
  background-color: var(--switch-bg);
  transition: background-color .1s linear;
  position: relative;

  &.active {
    background-color: var(--accent-color);

    .switch-dot {
      background-color: #fff;
      transform: translateX(11px);
    }
  }

  &-dot {
    transition: transform .15s ease;
    height: 11px;
    width: 11px;
    position: absolute;
    left: 2px;
    top: 0;
    bottom: 0;
    margin: auto 0;
    background-color: var(--switch-dot);
    border-radius: 7px;
    box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.2) inset;
  }
}
</style>
