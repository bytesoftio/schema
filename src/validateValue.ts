import {
  ValidationDefinition,
  ValidationError,
  ValidationFunction,
  ValidationFunctionResult,
} from "./types"
import { createValidationError } from "./createValidationError"
import { translateValidationDefinition } from "./translateValidationDefinition"
import { isValidationError } from "./isValidationError"
import {
  isArray,
  isString,
  isBoolean
} from "lodash"
import { Schema } from "./Schema"

export const validateValue = (value: any, definitions: ValidationDefinition[]): ValidationError[] => {
  const errors: ValidationError[] = []

  for (let definition of definitions) {
    if (definition.validator instanceof Schema) {
      const newErrors = definition.validator.validate(value)

      if (newErrors) {
        errors.push(...newErrors)
      }
    } else {
      let result = (definition.validator as ValidationFunction)(value, ...definition.args)

      if (result != undefined && result['then'] && result['catch']) {
        throw new Error("Trying to execute async validation logic in a sync call, use an async method instead")
      }

      // we might get a schema from a validation function
      if (result instanceof Schema) {
        result = result.validate(value)
      }

      // conditional definitions must always return some sort of an error,
      // boolean are useful for chaining and early exits from conditionals,
      // but can not represent an error
      if (["and", "or", "custom"].includes(definition.type) && isBoolean(result)) {
        continue
      }

      if (isValidationError(result as ValidationFunctionResult)) {
        if (isArray(result)) {
          // check for an array of validation errors
          errors.push(...result)
        } else {
          const error = createValidationError(
            definition.type,
            isString(result) ? result : translateValidationDefinition(definition),
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
