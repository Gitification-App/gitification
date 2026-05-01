import type { Ref } from 'vue'

export type Option<T> = T | null
export type MaybeRef<T> = T | Ref<T>
