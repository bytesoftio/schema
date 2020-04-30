import { ObjectShape } from "./schemas/ObjectSchema"
import { difference, keys } from "lodash"
import { ValidationError } from "./types"
import { createValidationError } from "./createValidationError"
import { translateMessage } from "./translateMessage"

export const validateObjectHasUnknownKeys = <T = any>(
  value: any,
  objectShape: ObjectShape<T> | undefined,
  allowUnknownKeysAndValues: boolean,
): ValidationError[] => {
  if (allowUnknownKeysAndValues) return []

  const unknownKeys = difference(keys(value), keys(objectShape))

  const errors: ValidationError[] = []

  unknownKeys.forEach(unknownKey => {
    const error = createValidationError(
      "object_unknown_key",
      translateMessage("object_unknown_key", [unknownKey]),
      [],
      value,
    )

    errors.push(error)
  })

  return errors
}