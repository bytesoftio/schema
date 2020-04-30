import { ValidationType } from "./types"
import { schemaTranslator } from "./schemaTranslator"

export const translateMessage = (key: ValidationType, args: any[] = []) => {
  return schemaTranslator.get(key, args)
}