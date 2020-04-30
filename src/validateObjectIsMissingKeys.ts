import { ObjectShape } from "./schemas/ObjectSchema"
import { difference, keys } from "lodash"
import { ValidationError } from "./types"
import { createValidationError } from "./createValidationError"
import { translateMessage } from "./translateMessage"

export const validateObjectIsMissingKeys = <T = any>(
  value: any,
  objectShape: ObjectShape<T> | undefined,
): ValidationError[] => {
  const missingKeys = difference(keys(objectShape), keys(value))

  const errors: ValidationError[] = []

  missingKeys.forEach(missingKey => {
    const error = createValidationError(
      "object_missing_key",
      translateMessage("object_missing_key", [missingKey]),
      [],
      value,
    )

    errors.push(error)
  })

  return errors
}