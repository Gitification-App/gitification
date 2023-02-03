<template>
  <main class="main">
    <slot />
  </main>
</template>

<style lang="scss" scoped>
.main {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--content-bg);
  position: relative;
}
</style>
