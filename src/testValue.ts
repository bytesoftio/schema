import { ValidationDefinition } from "./types"

export const testValue = (value: any, definitions: ValidationDefinition[]): boolean => {
  for (let definition of definitions) {
    const result = definition.validator(value, ...definition.args)

    if (result !== undefined && result['then'] && result['catch']) {
      throw new Error("Trying to execute async validation logic in a sync call, use an async method instead")
    }

    if (result === false) {
      return false
    }
  }

  return true
}
