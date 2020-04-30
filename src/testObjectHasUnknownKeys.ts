import { ObjectShape } from "./schemas/ObjectSchema"
import { difference, keys } from "lodash"

export const testObjectHasUnknownKeys = <T = any>(
  value: any,
  objectShape: ObjectShape<T> | undefined,
  allowUnknownKeysAndValues: boolean,
): boolean => {
  if ( ! objectShape) return true

  const unknownKeys = difference(keys(value), keys(objectShape))

  return allowUnknownKeysAndValues || unknownKeys.length === 0
}