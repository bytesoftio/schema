import { ObjectShape } from "./schemas/ObjectSchema"
import { ValidationError } from "./types"
import {
  get,
  keys,
} from "lodash"
import { joinPath } from "./helpers"

export const validateObjectShape = (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  language?: string,
  fallbackLanguage?: string
): ValidationError[] => {
  if ( ! objectShape) return []

  const errors: ValidationError[] = []

  keys(objectShape).map(key => {
    const shapeValue = objectShape[key]
    const keyValue = get(value, key)
    const newErrors = shapeValue.validate(keyValue, language, fallbackLanguage)

    if (newErrors) {
      newErrors.forEach(error => {
        error.path = joinPath(key, error.path)
        errors.push(error)
      })
    }
  })

  return errors
}
