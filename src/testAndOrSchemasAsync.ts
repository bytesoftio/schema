import { ValidationSchema } from "./types"

export const testAndOrSchemasAsync = async (
  value: any,
  testResult: boolean,
  andSchemas: ValidationSchema[],
  orSchemas: ValidationSchema[],
): Promise<boolean> => {
  if ( ! testResult) {
    for (const schema of orSchemas) {
      if (await schema.testAsync(value)) {
        testResult = true
        break
      }
    }
  }

  if (testResult) {
    for (const schema of andSchemas) {
      if ( ! await schema.testAsync(value)) {
        testResult = false
        break
      }
    }
  }

  return testResult
}
