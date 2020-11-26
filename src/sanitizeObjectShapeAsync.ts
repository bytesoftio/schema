import { ObjectShape } from "./schemas/ObjectSchema"
import {
  isObjectLike,
  keys,
} from "lodash"

export const sanitizeObjectShapeAsync = async <TValue, TSanitizedValue = TValue>(value: TValue, objectShape: ObjectShape<any> | undefined): Promise<TSanitizedValue> => {
  if ( ! objectShape || ! isObjectLike(value)) return value as any

  await Promise.all(keys(objectShape).map(async (shapeKey) => {
    const shapeValue = value[shapeKey]
    const shapeSchema = objectShape[shapeKey]
    const sanitizedValue = await shapeSchema.sanitizeAsync(shapeValue)

    value[shapeKey] = sanitizedValue
  }))

  return value as any
}
