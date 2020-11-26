import { ObjectShape } from "./schemas/ObjectSchema"
import { StringSchema } from "./schemas/StringSchema"
import {
  difference,
  keys,
} from "lodash"

export const testObjectUnknownValuesAsync = async (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  unknownValuesSchema: StringSchema | undefined,
): Promise<boolean> => {
  if ( ! unknownValuesSchema) return true

  const unknownKeys = difference(keys(value), keys(objectShape))

  for (const unknownKey of unknownKeys) {
    const unknownValue = value[unknownKey]

    if ( ! await unknownValuesSchema.testAsync(unknownValue)) {
      return false
    }
  }

  return true
}
