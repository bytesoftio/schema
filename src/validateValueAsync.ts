import {
  ValidationDefinition,
  ValidationError,
} from "./types"
import { translateValidationDefinition } from "./translateValidationDefinition"
import { createValidationError } from "./createValidationError"

export const validateValueAsync = async (value: any, definitions: ValidationDefinition[]): Promise<ValidationError[]> => {
  const errors: ValidationError[] = []

  for (let definition of definitions) {
    const result = await definition.validator(value, ...definition.args)

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
