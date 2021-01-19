import { createTranslator } from "@bytesoftio/translator"
import en from "./locales/en.json"
import de from "./locales/de.json"
import fr from "./locales/fr.json"
import it from "./locales/it.json"
import ru from "./locales/ru.json"

export const schemaTranslator = createTranslator({ en, de, fr, it, ru }, "en")
