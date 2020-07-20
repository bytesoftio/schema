import { SanitizerDefinition } from "./types"

export const sanitizeValue = async <TValue, TSanitizedValue = TValue>(value: TValue, definitions: SanitizerDefinition[]): Promise<TSanitizedValue> => {
  for (let definition of definitions) {
    value = await definition.sanitizer(value, ...definition.args)
  }

  return value as any
}
