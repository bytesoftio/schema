import { Schema } from "../Schema"
import {
  dateAfter,
  dateBefore,
  dateBetween,
  dateEquals,
  dateType,
  dateRequired,
  dateToDefault,
} from "../assertions/date"
import { CustomValidationMessage, LazyValue } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"

export class DateSchema extends Schema<Date> {
  constructor() {
    super()
    this.skipClone(() => this.required())
  }

  protected cloneInstance(): this {
    const schema = new DateSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.conditionalValidationDefinitions = [...this.conditionalValidationDefinitions]

    return schema as any
  }

  required(required?: LazyValue<boolean>, message?: CustomValidationMessage): this {
    return this
      .addValidationDefinition(createValidationDefinition("date_type", dateType, [], message))
      .addValidationDefinition(createValidationDefinition("date_required", dateRequired, [required], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("date_required")
      .addValidationDefinition(createValidationDefinition("date_type", dateType, [], message))
  }

  equals(equal: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("date_equals", dateEquals, [equal], message))
  }

  after(after: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("date_after", dateAfter, [after], message))
  }

  before(before: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("date_before", dateBefore, [before], message))
  }

  between(after: LazyValue<Date>, before: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("date_between", dateBetween, [after, before], message))
  }

  toDefault(defaultValue: LazyValue<Date> = new Date()): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(dateToDefault, [defaultValue]))
  }
}
