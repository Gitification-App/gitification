import dayjs from 'dayjs'

export function fromNow(date: string) {
  return dayjs(date).fromNow()
}
