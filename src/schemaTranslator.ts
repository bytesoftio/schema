import { createTranslator } from "@bytesoftio/use-translator"
import { locale } from "./locale"

export const schemaTranslator = createTranslator({ en: locale }, "en")