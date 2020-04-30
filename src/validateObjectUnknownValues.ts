import { ObjectShape } from "./schemas/ObjectSchema"
import { StringSchema } from "./schemas/StringSchema"
import { difference, keys } from "lodash"
import { ValidationError } from "./types"
import { joinPath } from "./helpers"

export const validateObjectUnknownValues = async (
  value: any,
  objectShape: ObjectShape<any> | undefined,
  unknownValuesSchema: StringSchema | undefined,
): Promise<ValidationError[]> => {
  if ( ! unknownValuesSchema) return []

  const unknownKeys = difference(keys(value), keys(objectShape))
  const errors: ValidationError[] = []

  await Promise.all(unknownKeys.map(async unknownKey => {
    const unknownValue = value[unknownKey]
    const newErrors = await unknownValuesSchema.validate(unknownValue)

    if (newErrors) {
      newErrors.forEach(error => {
        error.path = joinPath(unknownKey, error.path)
        errors.push(error)
      })
    }
  }))

  return errors
}