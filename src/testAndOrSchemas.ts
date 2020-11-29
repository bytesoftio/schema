import { ValidationDefinition } from "./types"
import { testValue } from "./testValue"

export const testAndOrSchemas = (
  value: any,
  testResult: boolean,
  conditionalValidationDefinitions: ValidationDefinition[],
): boolean => {
  for (const definition of conditionalValidationDefinitions) {
    if ( ! testResult && definition.type === "or") {
      if (testValue(value, [definition])) {
        testResult = true
      }
    }

    if (testResult && definition.type === "and") {
      if ( ! testValue(value, [definition])) {
        testResult = false
      }
    }
  }

  return testResult
}
