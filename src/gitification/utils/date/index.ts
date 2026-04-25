import type { Locale } from '../../../composables/useI18n'
import dayjs from 'dayjs'

export function fromNow(locale: Locale, date: string) {
  return dayjs(date).locale(locale).fromNow()
}
