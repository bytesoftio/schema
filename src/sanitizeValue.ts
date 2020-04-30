import { SanitizerDefinition } from "./types"

export const sanitizeValue = async <T, M = T>(value: T, definitions: SanitizerDefinition[]): Promise<M> => {
  for (let definition of definitions) {
    value = await definition.sanitizer(value, ...definition.args)
  }

  return value as any
}