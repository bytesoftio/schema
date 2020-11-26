import { ValidationSchema } from "./types"

export const testAndOrSchemas = (
  value: any,
  testResult: boolean,
  andSchemas: ValidationSchema[],
  orSchemas: ValidationSchema[],
): boolean => {
  if ( ! testResult) {
    for (const schema of orSchemas) {
      if (schema.test(value)) {
        testResult = true
        break
      }
    }
  }

  if (testResult) {
    for (const schema of andSchemas) {
      if ( ! schema.test(value)) {
        testResult = false
        break
      }
    }
  }

  return testResult
}
