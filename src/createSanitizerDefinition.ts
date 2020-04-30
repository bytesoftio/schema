import { LazyValue, SanitizerDefinition, SanitizerFunction } from "./types"

export const createSanitizerDefinition = (
  sanitizer: SanitizerFunction,
  args: LazyValue<any>[] = [],
): SanitizerDefinition => {
  return { sanitizer, args }
}