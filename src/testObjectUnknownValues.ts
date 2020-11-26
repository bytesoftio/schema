import { ObjectShape } from "./schemas/ObjectSchema"
import { StringSchema } from "./schemas/StringSchema"
import {
  difference,
  keys,
} from "lodash"

export const testObjectUnknownValues = (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  unknownValuesSchema: StringSchema | undefined,
): boolean => {
  if ( ! unknownValuesSchema) return true

  const unknownKeys = difference(keys(value), keys(objectShape))

  for (const unknownKey of unknownKeys) {
    const unknownValue = value[unknownKey]

    if ( ! unknownValuesSchema.test(unknownValue)) {
      return false
    }
  }

  return true
}
