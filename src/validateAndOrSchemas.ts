import {
  ValidationError,
  ValidationSchema,
} from "./types"
import { linkErrors } from "./linkErrors"

export const validateAndOrSchemas = (
  value: any,
  mainSchema: ValidationSchema,
  errors: ValidationError[],
  andSchemas: ValidationSchema[],
  orSchemas: ValidationSchema[],
): ValidationError[] => {
  if (errors.length > 0) {
    for (const schema of orSchemas) {
      const newErrors = schema.validate(value)

      if (newErrors) {
        errors.push(...linkErrors("or", newErrors))
      } else {
        errors = []
        break
      }
    }
  }

  for (const schema of andSchemas) {
    const newErrors = schema.validate(value)

    if (newErrors) {
      errors.push(...linkErrors("and", newErrors))
    }
  }

  return errors
}
