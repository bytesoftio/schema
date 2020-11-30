import { Schema } from "../Schema"
import { mixedEquals, mixedNoneOf, mixedOneOf, mixedRequired, mixedToDefault } from "../assertions/mixed"
import { CustomValidationMessage, LazyValue } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"

export class MixedSchema extends Schema<any> {
  protected cloneInstance(): this {
    const schema = new MixedSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.conditionalValidationDefinitions = [...this.conditionalValidationDefinitions]

    return schema as any
  }

  required(message?: CustomValidationMessage): this {
    return this
      .addValidationDefinition(createValidationDefinition("mixed_required", mixedRequired, [], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("mixed_required")
  }

  equals(equal: LazyValue<any>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("mixed_equals", mixedEquals, [equal], message))
  }

  oneOf(whitelist: LazyValue<(string | number | boolean)[]>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("mixed_one_of", mixedOneOf, [whitelist], message))
  }

  noneOf(blacklist: LazyValue<(string | number | boolean)[]>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("mixed_none_of", mixedNoneOf, [blacklist], message))
  }

  toDefault(defaultValue: LazyValue<any>): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(mixedToDefault, [defaultValue]))
  }
}
