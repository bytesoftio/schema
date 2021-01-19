import { ValidationType } from "./types"
import { schemaTranslator } from "./schemaTranslator"

export const translateMessage = (key: ValidationType, args: any[] = [], language?: string, fallbackLanguage?: string) => {
  return schemaTranslator.get(key, args, language, fallbackLanguage)
}
