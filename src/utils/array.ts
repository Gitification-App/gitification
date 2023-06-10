export type EverySomeCallback<T extends any[]> = (el: T[number], index: number, array: T[]) => boolean

export function everySome<T extends any[]>(array: T, callback: EverySomeCallback<T>) {
  let every = true
  let some = false

  for (let i = 0; i < array.length; i += 1) {
    const result = callback(array[i], i, array)

    if (every && !result)
      every = false

    if (!some && result)
      some = true
  }

  return { every, some }
}
