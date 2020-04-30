import { ObjectShape } from "./schemas/ObjectSchema"
import { difference, keys } from "lodash"
import { ValidationSchema } from "./types"

export const testObjectUnknownKeys = async (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  unknownKeysSchema: ValidationSchema | undefined,
): Promise<boolean> => {
  if ( ! unknownKeysSchema) return true

  const unknownKeys = difference(keys(value), keys(objectShape))

  for (const unknownKey of unknownKeys) {
    if ( ! await unknownKeysSchema.test(unknownKey)) {
      return false
    }
  }

  return true
}