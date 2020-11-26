import { ValidationSchema } from "./types"
import { isArray } from "lodash"

export const testArrayValues = (values: any, valuesSchema: ValidationSchema | undefined): boolean => {
  if ( ! valuesSchema || ! isArray(values)) return true

  for (let value of values) {
    if ( ! valuesSchema.test(value)) {
      return false
    }
  }

  return true
}
