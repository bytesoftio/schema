import {
  ValidationDefinition,
  ValidationError,
} from "./types"
import { createValidationError } from "./createValidationError"
import { translateValidationDefinition } from "./translateValidationDefinition"

export const validateValue = (value: any, definitions: ValidationDefinition[]): ValidationError[] => {
  const errors: ValidationError[] = []

  for (let definition of definitions) {
    const result = definition.validator(value, ...definition.args)

    if (result !== undefined && result['then'] && result['catch']) {
      throw new Error("Trying to execute async validation logic in a sync call, use an async method instead")
    }

    if (result === false || typeof(result) === "string") {
      const error = createValidationError(
        definition.type,
        typeof(result) === "string" ? result : translateValidationDefinition(definition),
        definition.args,
        value,
      )

      errors.push(error)
    }
  }

  return errors
}
