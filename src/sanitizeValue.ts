import { SanitizerDefinition } from "./types"

export const sanitizeValue = <TValue, TSanitizedValue = TValue>(value: TValue, definitions: SanitizerDefinition[]): TSanitizedValue => {
  for (let definition of definitions) {
    value = definition.sanitizer(value, ...definition.args)

    if (value !== undefined && value['then'] && value['catch']) {
      throw new Error("Trying to execute async sanitization logic in a sync call, use an async method instead")
    }
  }

  return value as any
}

