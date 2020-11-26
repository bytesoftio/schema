import { ObjectShape } from "./schemas/ObjectSchema"
import {
  difference,
  keys,
} from "lodash"
import { ValidationSchema } from "./types"

export const testObjectUnknownKeysAsync = async (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  unknownKeysSchema: ValidationSchema | undefined,
): Promise<boolean> => {
  if ( ! unknownKeysSchema) return true

  const unknownKeys = difference(keys(value), keys(objectShape))

  for (const unknownKey of unknownKeys) {
    if ( ! await unknownKeysSchema.testAsync(unknownKey)) {
      return false
    }
  }

  return true
}
