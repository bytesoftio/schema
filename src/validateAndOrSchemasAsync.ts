import {
  ValidationError,
  ValidationSchema,
} from "./types"
import { linkErrors } from "./linkErrors"

export const validateAndOrSchemasAsync = async (
  value: any,
  mainSchema: ValidationSchema,
  errors: ValidationError[],
  andSchemas: ValidationSchema[],
  orSchemas: ValidationSchema[],
): Promise<ValidationError[]> => {
  if (errors.length > 0) {
    for (const schema of orSchemas) {
      const newErrors = await schema.validateAsync(value)

      if (newErrors) {
        errors.push(...linkErrors("or", newErrors))
      } else {
        errors = []
        break
      }
    }
  }

  for (const schema of andSchemas) {
    const newErrors = await schema.validateAsync(value)

    if (newErrors) {
      errors.push(...linkErrors("and", newErrors))
    }
  }

  return errors
}
