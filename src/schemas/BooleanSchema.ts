import { Schema } from "../Schema"
import { booleanEquals, booleanType, booleanRequired, booleanToDefault } from "../assertions/boolean"
import { CustomValidationMessage, LazyValue } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"

export class BooleanSchema extends Schema<boolean> {
  constructor() {
    super()
    this.skipClone(() => this.required())
  }

  protected cloneInstance(): this {
    const schema = new BooleanSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.conditionalValidationDefinitions = [...this.conditionalValidationDefinitions]

    return schema as any
  }

  required(required?: LazyValue<boolean>, message?: CustomValidationMessage): this {
    return this
      .addValidationDefinition(createValidationDefinition("boolean_type", booleanType, [], message))
      .addValidationDefinition(createValidationDefinition("boolean_required", booleanRequired, [required], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("boolean_required")
      .addValidationDefinition(createValidationDefinition("boolean_type", booleanType, [], message))
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
