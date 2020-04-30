import { ObjectShape } from "./schemas/ObjectSchema"
import { isObjectLike, keys } from "lodash"

export const sanitizeObjectShape = async <T, M = T>(value: T, objectShape: ObjectShape<any> | undefined): Promise<M> => {
  if ( ! objectShape || ! isObjectLike(value)) return value as any

  await Promise.all(keys(objectShape).map(async (shapeKey) => {
    const shapeValue = value[shapeKey]
    const shapeSchema = objectShape[shapeKey]
    const sanitizedValue = await shapeSchema.sanitize(shapeValue)

    value[shapeKey] = sanitizedValue
  }))

  return value as any
}