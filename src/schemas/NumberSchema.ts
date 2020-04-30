import { Schema } from "../Schema"
import {
  numberBetween,
  numberEquals,
  numberInteger,
  numberMax,
  numberMin,
  numberNegative,
  numberOptional,
  numberPositive,
  numberRequired,
  numberToCeiled,
  numberToDefault,
  numberToFloored,
  numberToRounded,
  numberToTrunced,
} from "../assertions/number"
import { CustomValidationMessage, LazyValue } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"

export class NumberSchema extends Schema {
  protected cloneInstance(): this {
    const schema = new NumberSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.andSchemas = [...this.andSchemas]
    schema.orSchemas = [...this.orSchemas]

    return schema as any
  }

  required(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("number_optional")
      .addValidationDefinition(createValidationDefinition("number_required", numberRequired, [], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("number_required")
      .addValidationDefinition(createValidationDefinition("number_optional", numberOptional, [], message))
  }

  equals(equal: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("number_equals", numberEquals, [equal], message))
  }

  min(minValue: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("number_min", numberMin, [minValue], message))
  }

  max(maxValue: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("number_max", numberMax, [maxValue], message))
  }

  between(minValue: LazyValue<number>, maxValue: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("number_between", numberBetween, [minValue, maxValue], message))
  }

  positive(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("number_positive", numberPositive, [], message))
  }

  negative(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("number_negative", numberNegative, [], message))
  }

  integer(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("number_integer", numberInteger, [], message))
  }

  toDefault(defaultValue: LazyValue<number> = 0): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(numberToDefault, [defaultValue]))
  }

  toRounded(precision: LazyValue<number> = 0): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(numberToRounded, [precision]))
  }

  toFloored(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(numberToFloored))
  }

  toCeiled(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(numberToCeiled))
  }

  toTrunced(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(numberToTrunced))
  }
}