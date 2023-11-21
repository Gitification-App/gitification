<script lang="ts">
function transitionHandle(bg: HTMLElement, done: () => void, enter = true) {
  const content = bg.querySelector('.dialog-body') as HTMLElement

  bg.animate([
    { backgroundColor: 'rgba(0, 0, 0, 0)' },
    { backgroundColor: bg.style.backgroundColor },
  ], {
    duration: 150,
    fill: 'forwards',
    direction: enter ? 'normal' : 'reverse',
  })

  if (!enter)
    bg.style.pointerEvents = 'none'

  content.animate([
    { transform: 'scale(0.9)', opacity: 0 },
    { transform: 'scale(1)', opacity: 1 },
  ], {
    duration: 150,
    fill: 'forwards',
    direction: enter ? 'normal' : 'reverse',
    easing: 'ease',
  }).onfinish = done
}

const transitionEnterHandle = (el: any, done: any) => transitionHandle(el, done, true)
const transitionLeaveHandle = (el: any, done: any) => transitionHandle(el, done, false)
</script>

<script lang="ts" setup>
interface Props {
  title: string
  visible: boolean
}

interface Emits {
  (name: 'update:visible', value: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <Teleport to="body">
    <Transition
      appear
      @enter="transitionEnterHandle"
      @leave="transitionLeaveHandle"
    >
      <div
        v-if="props.visible"
        class="dialog-bg"
        @click.self="emit('update:visible', false)"
      >
        <div class="dialog-body">
          <div class="dialog-title">
            {{ props.title }}
          </div>
          <div class="dialog-content">
            <slot />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.dialog-bg {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 25px;

  .dialog-body {
    background-color: var(--content-bg);
    border-radius: 8px;
    min-width: 400px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 3px 8px -5px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .dialog-title {
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    border-bottom: 1px solid var(--item-bg);
    color: var(--text);
  }

  .dialog-content {
    padding: 10px;
    display: flex;
  }
}
</style>
