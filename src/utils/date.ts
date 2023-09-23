import dayjs from 'dayjs'
import { useI18n } from '../composables/useI18n'

const { currentLanguage } = useI18n()

export function fromNow(date: string) {
  return dayjs(date).locale(currentLanguage.value).fromNow()
}
