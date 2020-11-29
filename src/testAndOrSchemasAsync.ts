import { ValidationDefinition } from "./types"
import { testValueAsync } from "./testValueAsync"

export const testAndOrSchemasAsync = async (
  value: any,
  testResult: boolean,
  conditionalValidationDefinitions: ValidationDefinition[],
): Promise<boolean> => {
  for (const definition of conditionalValidationDefinitions) {
    if ( ! testResult && definition.type === "or") {
      if (await testValueAsync(value, [definition])) {
        testResult = true
      }
    }

    if (testResult && definition.type === "and") {
      if ( ! await testValueAsync(value, [definition])) {
        testResult = false
      }
    }
  }

  return testResult
}
