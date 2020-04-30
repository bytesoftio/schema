import { compact, isArray, isObject, isPlainObject, map, mapKeys, mapValues } from "lodash"

// https://github.com/Kikobeats/map-values-deep
export const mapValuesDeep = (object: object, mapper: (value: any, key: string | number) => any, key?: string | number) => {
  if (isArray(object)) {
    return map(object, (innerObject, index) => mapValuesDeep(innerObject, mapper, index))
  }

  if (isPlainObject(object)) {
    return mapValues(object, (value, key) => mapValuesDeep(value, mapper, key))
  }

  if (isObject(object)) {
    return object
  }

  return mapper(object, key!)
}

// https://github.com/Kikobeats/map-keys-deep
export const mapKeysDeep = (object: object, mapper: (value: any, key: string) => string) => {
  if (isArray(object)) {
    return map(object, item => mapKeysDeep(item, mapper))
  }

  if (isPlainObject(object)) {
    return mapValues(mapKeys(object, mapper), value => mapKeysDeep(value, mapper))
  }

  return object
}

export const joinPath = (...parts: (string | undefined)[]): string => {
  return compact(parts).join(".")
}