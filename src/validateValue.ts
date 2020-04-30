import { ValidationDefinition, ValidationError } from "./types"
import { translateValidationDefinition } from "./translateValidationDefinition"
import { createValidationError } from "./createValidationError"

export const validateValue = (value: any, definitions: ValidationDefinition[]): ValidationError[] => {
  const errors: ValidationError[] = []

  for (let definition of definitions) {
    const result = definition.validator(value, ...definition.args)

    if (result === false) {
      const error = createValidationError(
        definition.type,
        translateValidationDefinition(definition),
        definition.args,
        value,
      )

      errors.push(error)
    }
  }

  return errors
}