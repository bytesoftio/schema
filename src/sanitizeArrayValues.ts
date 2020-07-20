import { ValidationSchema } from "./types"
import { isArray } from "lodash"

export const sanitizeArrayValues = async <TValue, TSanitizedValue = TValue>(value: TValue, valuesSchema: ValidationSchema | undefined): Promise<TSanitizedValue> => {
  if ( ! valuesSchema || ! isArray(value)) return value as any

  return await Promise.all(value.map(async (item) => {
    return await valuesSchema.sanitize<TValue, TSanitizedValue>(item)
  })) as any
}
