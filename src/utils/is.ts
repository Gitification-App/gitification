const typeOf = (value: any) => Object.prototype.toString.call(value).slice(8, -1)

export function isObject<T = Record<PropertyKey, any>>(value: T): value is T {
  return typeOf(value) === 'Object'
}
