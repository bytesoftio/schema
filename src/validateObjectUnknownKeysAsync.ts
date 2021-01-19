import { ObjectShape } from "./schemas/ObjectSchema"
import {
  difference,
  keys,
} from "lodash"
import {
  ValidationError,
  ValidationSchema,
} from "./types"
import { joinPath } from "./helpers"

export const validateObjectUnknownKeysAsync = async (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  unknownKeysSchema: ValidationSchema | undefined,
  language?: string,
  fallbackLanguage?: string
): Promise<ValidationError[]> => {
  if ( ! unknownKeysSchema) return []

  const unknownKeys = difference(keys(value), keys(objectShape))
  const errors: ValidationError[] = []

  await Promise.all(unknownKeys.map(async (unknownKey) => {
    const newErrors = await unknownKeysSchema.validateAsync(unknownKey, language, fallbackLanguage)

    if (newErrors) {
      newErrors.forEach(error => {
        error.path = joinPath(unknownKey, error.path)
        errors.push(error)
      })
    }
  }))

  return errors
}

