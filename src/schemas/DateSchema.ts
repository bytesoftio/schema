import { Schema } from "../Schema"
import {
  dateAfter,
  dateBefore,
  dateBetween,
  dateEquals,
  dateOptional,
  dateRequired,
  dateToDefault,
} from "../assertions/date"
import { CustomValidationMessage, LazyValue } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"

export class DateSchema extends Schema {
  protected cloneInstance(): this {
    const schema = new DateSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.andSchemas = [...this.andSchemas]
    schema.orSchemas = [...this.orSchemas]

    return schema as any
  }

  required(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("date_optional")
      .addValidationDefinition(createValidationDefinition("date_required", dateRequired, [], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("date_required")
      .addValidationDefinition(createValidationDefinition("date_optional", dateOptional, [], message))
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