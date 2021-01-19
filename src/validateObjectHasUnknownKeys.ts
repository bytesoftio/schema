import { ObjectShape } from "./schemas/ObjectSchema"
import { difference, keys, isObjectLike } from "lodash"
import { ValidationError } from "./types"
import { createValidationError } from "./createValidationError"
import { translateMessage } from "./translateMessage"

export const validateObjectHasUnknownKeys = <TValue = any>(
  value: any,
  objectShape: ObjectShape<TValue> | undefined,
  allowUnknownKeysAndValues: boolean,
  language?: string,
  fallbackLanguage?: string
): ValidationError[] => {
  if (allowUnknownKeysAndValues || ! isObjectLike(value)) return []

  const unknownKeys = difference(keys(value), keys(objectShape))

  const errors: ValidationError[] = []

  unknownKeys.forEach(unknownKey => {
    const error = createValidationError(
      "object_unknown_key",
      translateMessage("object_unknown_key", [unknownKey], language, fallbackLanguage),
      [],
      value,
    )

    errors.push(error)
  })

  return errors
}
