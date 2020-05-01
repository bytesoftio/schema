import { createTranslator } from "@bytesoftio/translator"
import { locale } from "./locale"

export const schemaTranslator = createTranslator({ en: locale }, "en")