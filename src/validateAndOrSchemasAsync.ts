import {
  ValidationDefinition,
  ValidationError,
} from "./types"
import { linkErrors } from "./linkErrors"
import { validateValueAsync } from "./validateValueAsync"

export const validateAndOrSchemasAsync = async (
  value: any,
  errors: ValidationError[],
  conditionalValidationDefinitions: ValidationDefinition[],
): Promise<ValidationError[]> => {
  for (const definition of conditionalValidationDefinitions) {
    if (errors.length > 0 && definition.type === "or") {
      const newErrors = await validateValueAsync(value, [definition])

      if (newErrors.length === 0) {
        errors = []
      } else {
        errors = [...errors, ...linkErrors("or", newErrors)]
      }
    }

    if (errors.length === 0 && definition.type === "and") {
      const newErrors = await validateValueAsync(value, [definition])

      if (newErrors.length > 0) {
        errors = linkErrors("and", newErrors)
      }
    }
  }

  return errors
}
