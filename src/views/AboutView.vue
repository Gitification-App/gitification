<script lang="ts" setup>
import markdownit from 'markdown-it'
import { onMounted, shallowRef } from 'vue'
import * as Gitification from '../gitification/index'
import * as UI from '../ui'

const md = markdownit({
})
const changelog = shallowRef<string | null>(null)

async function loadChangelog() {
  try {
    const response = await window.fetch('https://raw.githubusercontent.com/Gitification-App/gitification/refs/heads/main/CHANGELOG.md')
    if (!response.ok) {
      return null
    }
    const text = await response.text()
    return text
  }
  catch {
    return null
  }
}

onMounted(async () => {
  changelog.value = md.render(await loadChangelog() ?? 'Failed to load changelog')
})

const version = __APP_VERSION__
</script>

<template>
  <UI.Page>
    <UI.PageHeader @back="Gitification.router.navigate('home')">
      About
    </UI.PageHeader>

    <UI.PageContent class="with-attention space-y-5 pb-20">
      <div class="space-y-3">
        <div class="text-xl font-medium text-txt-1">
          Gitification <span class="font-mono font-medium tracking-tighter text-primary text-xs">{{ version }}</span>
        </div>

        <div class=" flex flex-row gap-2">
          <UI.Button
            paddingVariant="sm"
            variant="secondary"
            @click="Gitification.actions.openURL('https://github.com/Gitification-App/gitification/issues/new')"
          >
            <template #leftIcon>
              <UI.Icons.IssueOpened24 />
            </template>
            Report bug
          </UI.Button>

          <UI.Button
            paddingVariant="sm"
            variant="secondary"
            @click="Gitification.actions.openURL('https://github.com/Gitification-App/gitification')"
          >
            <template #leftIcon>
              <UI.Icons.Github01 />
            </template>
            See Repository
          </UI.Button>
        </div>
      </div>

      <div class="border-b border-surface-2 w-full" />

      <div class="space-y-3">
        <div class="text-xl text-txt-1 font-bold">
          Changelog
        </div>
        <div
          class="pl-4 prose max-w-none"
          v-html="changelog"
        />
      </div>
    </UI.PageContent>
  </UI.Page>
</template>
