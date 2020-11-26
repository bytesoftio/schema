import { isArray } from "lodash"
import { ValidationSchema } from "./types"

export const testArrayValuesAsync = async (values: any, valuesSchema: ValidationSchema | undefined): Promise<boolean> => {
  if ( ! valuesSchema || ! isArray(values)) return true

  for (let value of values) {
    if ( ! await valuesSchema.testAsync(value)) {
      return false
    }
  }

  return true
}

