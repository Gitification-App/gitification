export function isIndeterminate<T extends unknown[]>(array: T, predicate: (item: T[number]) => boolean): boolean {
  let hasTruthy = false
  let hasFalsy = false

  for (const item of array) {
    if (hasTruthy && hasFalsy) {
      break
    }

    const result = predicate(item)

    if (result) {
      hasTruthy = true
    }
    else {
      hasFalsy = true
    }
  }

  return hasTruthy && hasFalsy
}

export function filterNewItems<T extends unknown[]>(array: T, newArray: T, selector: (item: T[number]) => any): T {
  const oldItems = new Set(array.map(selector))

  return newArray
    .filter((item) => !oldItems.has(selector(item))) as T
}
