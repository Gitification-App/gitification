import { useMediaQuery } from '@vueuse/core'
import { computed } from 'vue'
import { ColorPreference } from '../constants'
import * as Gitification from '../gitification'
import { singleton } from '../utils/common'

export const useTheme = singleton(() => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = computed(() => {
    const preference = Gitification.storage.get('colorPreference')

    let theme: ColorPreference.Dark | ColorPreference.Light

    if (preference === ColorPreference.Dark) {
      theme = ColorPreference.Dark
    }
    else if (preference === ColorPreference.Light) {
      theme = ColorPreference.Light
    }
    else {
      theme = prefersDark.value ? ColorPreference.Dark : ColorPreference.Light
    }

    return theme
  })

  return { theme, prefersDark }
})
