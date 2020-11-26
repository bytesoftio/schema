import { Schema } from "../Schema"
import {
  stringAlpha,
  stringAlphaDashes,
  stringAlphaNumeric,
  stringAlphaNumericDashes,
  stringAlphaNumericUnderscores,
  stringAlphaUnderscores,
  stringBetween,
  stringDate,
  stringDateAfter,
  stringDateBefore,
  stringDateBetween,
  stringDateTime,
  stringEmail,
  stringEndsWith,
  stringEquals,
  stringIncludes,
  stringLength,
  stringMatches,
  stringMax,
  stringMin,
  stringNoneOf,
  stringNumeric,
  stringOmits,
  stringOneOf,
  stringOptional,
  stringRequired,
  stringStartsWith,
  stringTime,
  stringTimeAfter,
  stringTimeBefore,
  stringTimeBetween,
  stringToCamelCase,
  stringToCapitalized,
  stringToConstantCase,
  stringToDefault,
  stringToKebabCase,
  stringToLowerCase,
  stringToSnakeCase,
  stringToTrimmed,
  stringToUpperCase,
  stringUrl,
} from "../assertions/string"
import { CustomValidationMessage, LazyValue } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"

export class StringSchema extends Schema {
  protected cloneInstance(): this {
    const schema = new StringSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.andSchemas = [...this.andSchemas]
    schema.orSchemas = [...this.orSchemas]

    return schema as any
  }

  required(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("string_optional")
      .addValidationDefinition(createValidationDefinition("string_required", stringRequired, [], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("string_required")
      .addValidationDefinition(createValidationDefinition("string_optional", stringOptional, [], message))
  }

  equals(equal: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_equals", stringEquals, [equal], message))
  }

  length(exactLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_length", stringLength, [exactLength], message))
  }

  min(minLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_min", stringMin, [minLength], message))
  }

  max(maxLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_max", stringMax, [maxLength], message))
  }

  between(minLength: LazyValue<number>, maxLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_between", stringBetween, [minLength, maxLength], message))
  }

  matches(regex: LazyValue<RegExp>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_matches", stringMatches, [regex], message))
  }

  email(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_email", stringEmail, [], message))
  }

  url(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_url", stringUrl, [], message))
  }

  startsWith(find: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_starts_with", stringStartsWith, [find], message))
  }

  endsWith(find: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_ends_with", stringEndsWith, [find], message))
  }

  includes(find: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_includes", stringIncludes, [find], message))
  }

  omits(find: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_omits", stringOmits, [find], message))
  }

  oneOf(whitelist: LazyValue<string[]>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_one_of", stringOneOf, [whitelist], message))
  }

  noneOf(blacklist: LazyValue<string[]>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_none_of", stringNoneOf, [blacklist], message))
  }

  numeric(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_numeric", stringNumeric, [], message))
  }

  alpha(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_alpha", stringAlpha, [], message))
  }

  alphaNumeric(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_alpha_numeric", stringAlphaNumeric, [], message))
  }

  alphaDashes(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_alpha_dashes", stringAlphaDashes, [], message))
  }

  alphaUnderscores(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_alpha_underscores", stringAlphaUnderscores, [], message))
  }

  alphaNumericDashes(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_alpha_numeric_dashes", stringAlphaNumericDashes, [], message))
  }

  alphaNumericUnderscores(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_alpha_numeric_underscores", stringAlphaNumericUnderscores, [], message))
  }

  date(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date", stringDate, [], message))
  }

  time(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_time", stringTime, [], message))
  }

  dateTime(message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date_time", stringDateTime, [], message))
  }

  dateBefore(before: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date_before", stringDateBefore, [before, false], message))
  }

  dateBeforeOrSame(before: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date_before_or_same", stringDateBefore, [before, true], message))
  }

  dateAfter(after: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date_after", stringDateAfter, [after, false], message))
  }

  dateAfterOrSame(after: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date_after_or_same", stringDateAfter, [after, true], message))
  }

  dateBetween(after: LazyValue<Date>, before: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date_between", stringDateBetween, [after, before, false], message))
  }

  dateBetweenOrSame(after: LazyValue<Date>, before: LazyValue<Date>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_date_between_or_same", stringDateBetween, [after, before, true], message))
  }

  timeBefore(before: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_time_before", stringTimeBefore, [before, false], message))
  }

  timeBeforeOrSame(before: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_time_before_or_same", stringTimeBefore, [before, true], message))
  }

  timeAfter(after: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_time_after", stringTimeAfter, [after, false], message))
  }

  timeAfterOrSame(after: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_time_after_or_same", stringTimeAfter, [after, true], message))
  }

  timeBetween(after: LazyValue<string>, before: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_time_between", stringTimeBetween, [after, before, false], message))
  }

  timeBetweenOrSame(after: LazyValue<string>, before: LazyValue<string>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("string_time_between_or_same", stringTimeBetween, [after, before, true], message))
  }

  toDefault(defaultValue: LazyValue<string> = ""): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToDefault, [defaultValue]))
  }

  toUpperCase(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToUpperCase))
  }

  toLowerCase(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToLowerCase))
  }

  toCapitalized(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToCapitalized))
  }

  toCamelCase(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToCamelCase))
  }

  toSnakeCase(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToSnakeCase))
  }

  toKebabCase(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToKebabCase))
  }

  toConstantCase(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToConstantCase))
  }

  toTrimmed(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(stringToTrimmed))
  }
}
