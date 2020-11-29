import {
  ValidationDefinition,
  ValidationFunction,
} from "./types"
import { isValidationError } from "./isValidationError"
import { Schema } from "./Schema"
import { isBoolean } from "lodash"

export const testValueAsync = async (value: any, definitions: ValidationDefinition[]): Promise<boolean> => {
  for (let definition of definitions) {
    if (definition.validator instanceof Schema) {
      const result = await definition.validator.testAsync(value)

      if ( ! result) {
        return false
      }
    } else {
      let result = await (definition.validator as ValidationFunction)(value, ...definition.args)

      if (["and", "or"].includes(definition.type) && isBoolean(result)) {
        continue
      }

      if (result instanceof Schema) {
        result = await result.testAsync(value)
      }

      if (isValidationError(result)) {
        return false
      }
    }
  }

  return true
}
