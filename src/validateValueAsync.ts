import {
  ValidationDefinition,
  ValidationError,
  ValidationFunction,
} from "./types"
import { translateValidationDefinition } from "./translateValidationDefinition"
import { createValidationError } from "./createValidationError"
import { isValidationError } from "./isValidationError"
import {
  isArray,
  isBoolean,
  isString,
} from "lodash"
import { Schema } from "./Schema"

export const validateValueAsync = async (
  value: any,
  definitions: ValidationDefinition[],
  language?: string,
  fallbackLanguage?: string
): Promise<ValidationError[]> => {
  const errors: ValidationError[] = []

  for (let definition of definitions) {
    if (definition.validator instanceof Schema) {
      const newErrors = await definition.validator.validateAsync(value, language, fallbackLanguage)

      if (newErrors) {
        errors.push(...newErrors)
      }
    } else {
      let result = await (definition.validator as ValidationFunction)(value, ...definition.args)

      if (result instanceof Schema) {
        result = await result.validateAsync(value, language, fallbackLanguage)
      }

      if (["and", "or", "custom"].includes(definition.type) && isBoolean(result)) {
        continue
      }

      if (isValidationError(result)) {
        if (isArray(result)) {
          errors.push(...result)
        } else {
          const error = createValidationError(
            definition.type,
            isString(result) ? result : translateValidationDefinition(definition, language, fallbackLanguage),
            definition.args,
            value,
          )

          errors.push(error)
        }
      }
    }
  }

  return errors
}
