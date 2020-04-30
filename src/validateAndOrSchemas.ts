import { ValidationError, ValidationLink, ValidationSchema } from "./types"
import { joinPath } from "./helpers"

export const validateAndOrSchemas = async (
  value: any,
  mainSchema: ValidationSchema,
  errors: ValidationError[],
  andSchemas: ValidationSchema[],
  orSchemas: ValidationSchema[],
): Promise<ValidationError[]> => {
  if (errors.length > 0) {
    for (const schema of orSchemas) {
      const newErrors = await schema.validate(value)

      if (newErrors) {
        errors.push(...linkErrors("or", newErrors))
      } else {
        errors = []
        break
      }
    }
  }

  for (const schema of andSchemas) {
    const newErrors = await schema.validate(value)

    if (newErrors) {
      errors.push(...linkErrors("and", newErrors))
    }
  }

  return errors
}

const linkErrors = (link: ValidationLink, errors: ValidationError[]): ValidationError[] => {
  errors.forEach(error => error.link = joinPath(link, error.link))

  return errors
}