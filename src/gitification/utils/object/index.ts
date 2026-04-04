export function groupBy<T, K extends string | number | symbol>(array: T[], keySelector: (item: T) => K): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keySelector(item)

    if (!groups[key]) {
      groups[key] = []
    }

    groups[key].push(item)

    return groups
  }, {} as Record<K, T[]>)
}
