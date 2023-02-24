<script setup lang="ts">
import BottomBarItem from './BottomBarItem.vue'

export interface IBottomBarItem {
  onSelect: () => void
  hotkey: string
  text: string
  withCommand: boolean
}

interface Props {
  selectedCount: number
  items?: IBottomBarItem[]
}

withDefaults(defineProps<Props>(), {
  items: () => [],
})
</script>

<template>
  <div class="bottom-bar">
    <span class="bottom-bar-count">{{ selectedCount }}</span>
    <BottomBarItem
      v-for="(item, index) of items"
      :key="index"
      v-bind="item"
      @select="item.onSelect()"
    />
  </div>
</template>

<style lang="scss" scoped>
.bottom-bar {
  height: 40px;
  border-top: 1px solid #2c2c2c;
  padding: 5px 10px;
  width: 100%;
  display: flex;
  background-color: var(--bottom-bar-bg);
  flex-flow: row nowrap;
  justify-content: flex-end;

  &-count {
    margin-right: auto;
    display: inline-flex;
    align-items: center;
    color: var(--white);
    font-weight: bold;
    font-size: 12px;

    &::before {
      content: '';
      width: 8px;
      height: 8px;
      margin-right: 5px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 3px solid transparent;
      background-clip: padding-box;
      background-color: var(--white);
      box-shadow: 0px 0px 0px 1px var(--white);
    }
  }

  > * + * {
    margin-left: 5px;
  }

}
</style>
