import { ValidationDefinition } from "./types"

export const testValueAsync = async (value: any, definitions: ValidationDefinition[]): Promise<boolean> => {
  for (let definition of definitions) {
    const result = await definition.validator(value, ...definition.args)

    if (result === false) {
      return false
    }
  }

  return true
}
