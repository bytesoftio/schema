import { ValidationDefinition } from "./types"
import { lazyValue } from "./lazyValue"
import { translateMessage } from "./translateMessage"

export const translateValidationDefinition = (definition: ValidationDefinition): string => {
  const customMessage = lazyValue(definition.customMessage)

  return customMessage || translateMessage(definition.type, definition.args)
}