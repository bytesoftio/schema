import { Schema } from "../Schema"
import { booleanEquals, booleanOptional, booleanRequired, booleanToDefault } from "../assertions/boolean"
import { CustomValidationMessage, LazyValue } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"

export class BooleanSchema extends Schema<boolean> {
  protected cloneInstance(): this {
    const schema = new BooleanSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.conditionalValidationDefinitions = [...this.conditionalValidationDefinitions]

    return schema as any
  }

  required(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("boolean_optional")
      .addValidationDefinition(createValidationDefinition("boolean_required", booleanRequired, [], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("boolean_required")
      .addValidationDefinition(createValidationDefinition("boolean_optional", booleanOptional, [], message))
  }

  equals(equal: LazyValue<boolean>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(
      createValidationDefinition("boolean_equals", booleanEquals, [equal], message),
    )
  }

  toDefault(defaultValue: LazyValue<boolean> = false): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(booleanToDefault, [defaultValue]))
  }
}
