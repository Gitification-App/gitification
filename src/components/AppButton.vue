<script lang="ts" setup>
interface Props {
  loading?: boolean
  paddingless?: boolean
  square?: boolean
  ghost?: boolean
}
interface Emits {
  (name: 'click', event: MouseEvent): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  paddingless: false,
  square: false,
})
const emit = defineEmits<Emits>()

function handleClick(e: MouseEvent) {
  if (props.loading)
    return

  emit('click', e)
}
</script>

<template>
  <button
    :disabled="loading || undefined"
    class="button"
    :class="{
      'button-loading': loading,
      'button-paddingless': paddingless,
      'button-square': square,
      'button-ghost': ghost,
    }"
    @click="handleClick"
  >
    <div
      v-if="loading"
      class="button-loading-indicator"
    >
      <div class="button-loading-indicator-outer" />
      <div class="button-loading-indicator-inner" />
    </div>

    <div class="button-content">
      <slot />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.button {
  height: 35px;
  font-size: 14px;
  padding: 8px 12px;
  position: relative;
  overflow: hidden;
  color: var(--white);
  border-radius: 8px;
  vertical-align: middle;

  &-content {
    display: flex;
    flex-direction: row;
    white-space: nowrap;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  &:not(.button-ghost) {
    background-color: var(--item-bg);
  }

  &-paddingless, &-square {
    padding: 0px;
  }

  &-square {
    display: inline-flex;
    height: 35px;
    width: 35px;
    align-items: center;
    justify-content: center;
  }

  &-loading {
    .button-content {
      opacity: 0;
    }
  }

  &:not(.button-loading) {
    @include focus-visible;

    &:active, &:hover {
      background-color: var(--item-hover-bg);
    }
  }
}

.button-loading-indicator {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

  $animation-cubic-bezier: cubic-bezier(.57,-0.66,.48,1.66);

  &-inner {
    animation: .75s button-loading-inner-anim $animation-cubic-bezier infinite alternate-reverse;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: var(--white);
    position: relative;
  }

  &-outer {
    animation: 1.5s button-loading-outer-anim $animation-cubic-bezier infinite;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    border: 2px solid var(--app-border);
  }
}

@keyframes button-loading-outer-anim {
  0% {
    transform: scale(0.25);
    opacity: 1;
  }

  25% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
    transform: scale(1);
  }
}

@keyframes button-loading-inner-anim {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.5);
  }
}
</style>
