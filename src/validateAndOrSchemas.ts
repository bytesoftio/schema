import {
  ValidationDefinition,
  ValidationError,
} from "./types"
import { linkErrors } from "./linkErrors"
import { validateValue } from "./validateValue"

export const validateAndOrSchemas = (
  value: any,
  errors: ValidationError[],
  conditionalValidationDefinitions: ValidationDefinition[],
  language?: string,
  fallbackLanguage?: string
): ValidationError[] => {
  for (const definition of conditionalValidationDefinitions) {
    if (errors.length > 0 && definition.type === "or") {
      const newErrors = validateValue(value, [definition], language, fallbackLanguage)

      if (newErrors.length === 0) {
        errors = []
      } else {
        errors = [...errors, ...linkErrors("or", newErrors)]
      }
    }

    if (errors.length === 0 && definition.type === "and") {
      const newErrors = validateValue(value, [definition], language, fallbackLanguage)

      if (newErrors.length > 0) {
        errors = linkErrors("and", newErrors)
      }
    }
  }

  return errors
}
