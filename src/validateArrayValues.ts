import { isArray } from "lodash"
import { ValidationError, ValidationSchema } from "./types"
import { joinPath } from "./helpers"

export const validateArrayValues = async (
  values: any,
  valuesSchema: ValidationSchema | undefined,
): Promise<ValidationError[]> => {
  if ( ! valuesSchema || ! isArray(values)) return []

  const errors: ValidationError[] = []

  await Promise.all(values.map(async (value, index) => {
    const newErrors = await valuesSchema.validate(value)

    if (newErrors) {
      newErrors.forEach(error => {
        error.path = joinPath(index.toString(), error.path)
        errors.push(error)
      })
    }
  }))

  return errors
}