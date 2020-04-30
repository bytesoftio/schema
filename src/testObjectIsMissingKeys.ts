import { ObjectShape } from "./schemas/ObjectSchema"
import { difference, keys } from "lodash"

export const testObjectIsMissingKeys = <T = any>(
  value: any,
  objectShape: ObjectShape<T> | undefined,
): boolean => {
  if ( ! objectShape) return true

  const missingKeys = difference(keys(objectShape), keys(value))

  return missingKeys.length === 0
}