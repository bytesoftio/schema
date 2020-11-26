import { ObjectShape } from "./schemas/ObjectSchema"
import { StringSchema } from "./schemas/StringSchema"
import { ValidationError } from "./types"
import {
  difference,
  keys,
} from "lodash"
import { joinPath } from "./helpers"

export const validateObjectUnknownValues = (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  unknownValuesSchema: StringSchema | undefined,
): ValidationError[] => {
  if ( ! unknownValuesSchema) return []

  const unknownKeys = difference(keys(value), keys(objectShape))
  const errors: ValidationError[] = []

  unknownKeys.map(async unknownKey => {
    const unknownValue = value[unknownKey]
    const newErrors = await unknownValuesSchema.validate(unknownValue)

    if (newErrors) {
      newErrors.forEach(error => {
        error.path = joinPath(unknownKey, error.path)
        errors.push(error)
      })
    }
  })

  return errors
}
