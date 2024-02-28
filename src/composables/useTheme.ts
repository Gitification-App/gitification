import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { singleton } from '../utils/common'
import { AppStorage } from '../storage'
import { ColorPreference } from '../constants'

export const useTheme = singleton(() => {
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')

  const theme = computed(() => {
    const preference = AppStorage.get('colorPreference')

    let theme: ColorPreference.Dark | ColorPreference.Light

    if (preference === ColorPreference.Dark)
      theme = ColorPreference.Dark
    else if (preference === ColorPreference.Light)
      theme = ColorPreference.Light
    else
      theme = prefersDark.value ? ColorPreference.Dark : ColorPreference.Light

    return theme
  })

  return { theme, prefersDark }
})
