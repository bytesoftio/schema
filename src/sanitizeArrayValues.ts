import { ValidationSchema } from "./types"
import { isArray } from "lodash"

export const sanitizeArrayValues = async <T, M = T>(value: T, valuesSchema: ValidationSchema | undefined): Promise<M> => {
  if ( ! valuesSchema || ! isArray(value)) return value as any

  return await Promise.all(value.map(async (item) => {
    return await valuesSchema.sanitize<T, M>(item)
  })) as any
}