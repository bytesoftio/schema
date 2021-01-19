import { isArray } from "lodash"
import {
  ValidationError,
  ValidationSchema,
} from "./types"
import { joinPath } from "./helpers"

export const validateArrayValuesAsync = async (
  values: any,
  valuesSchema: ValidationSchema | undefined,
  language?: string,
  fallbackLanguage?: string
): Promise<ValidationError[]> => {
  if ( ! valuesSchema || ! isArray(values)) return []

  const errors: ValidationError[] = []

  await Promise.all(values.map(async (value, index) => {
    const newErrors = await valuesSchema.validateAsync(value, language, fallbackLanguage)

    if (newErrors) {
      newErrors.forEach(error => {
        error.path = joinPath(index.toString(), error.path)
        errors.push(error)
      })
    }
  }))

  return errors
}

