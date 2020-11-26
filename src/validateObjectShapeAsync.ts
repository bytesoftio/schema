import { ObjectShape } from "./schemas/ObjectSchema"
import { ValidationError } from "./types"
import {
  get,
  keys,
} from "lodash"
import { joinPath } from "./helpers"

export const validateObjectShapeAsync = async (
  value: any,
  objectShape: ObjectShape<any> | undefined,
): Promise<ValidationError[]> => {
  if ( ! objectShape) return []

  const errors: ValidationError[] = []

  await Promise.all(keys(objectShape).map(async key => {
    const shapeValue = objectShape[key]
    const keyValue = get(value, key)
    const newErrors = await shapeValue.validateAsync(keyValue)

    if (newErrors) {
      newErrors.forEach(error => {
        error.path = joinPath(key, error.path)
        errors.push(error)
      })
    }
  }))

  return errors
}
