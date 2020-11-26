import { ValidationSchema } from "./types"
import { isArray } from "lodash"

export const sanitizeArrayValues = <TValue, TSanitizedValue = TValue>(value: TValue, valuesSchema: ValidationSchema | undefined): TSanitizedValue => {
  if ( ! valuesSchema || ! isArray(value)) return value as any

  return value.map((item) => {
    return valuesSchema.sanitize<TValue, TSanitizedValue>(item)
  }) as any
}
