import {
  ValidationDefinition,
  ValidationFunction,
  ValidationFunctionResult,
} from "./types"
import { isValidationError } from "./isValidationError"
import { Schema } from "./Schema"
import { isBoolean } from "lodash"

export const testValue = (value: any, definitions: ValidationDefinition[]): boolean => {
  for (let definition of definitions) {
    if (definition.validator instanceof Schema) {
      const result = definition.validator.test(value)

      if ( ! result) {
        return false
      }
    } else {
      let result = (definition.validator as ValidationFunction)(value, ...definition.args)

      if (result !== undefined && result['then'] && result['catch']) {
        throw new Error("Trying to execute async validation logic in a sync call, use an async method instead")
      }

      // conditional definitions must always return some sort of an error,
      // boolean are useful for chaining and early exits from conditionals,
      // but can not represent an error
      if (["and", "or"].includes(definition.type) && isBoolean(result)) {
        continue
      }

      if (result instanceof Schema) {
        result = result.test(value)
      }

      if (isValidationError(result as ValidationFunctionResult)) {
        return false
      }
    }
  }

  return true
}
