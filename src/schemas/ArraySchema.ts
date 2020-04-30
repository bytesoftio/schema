import { Schema } from "../Schema"
import {
  arrayBetween,
  arrayEquals,
  arrayLength,
  arrayMax,
  arrayMin,
  arrayNoneOf,
  arrayOptional,
  arrayRequired,
  arraySomeOf,
  arrayToCompact,
  arrayToDefault,
  arrayToFiltered,
  arrayToMapped, arrayToUnique,
} from "../assertions/array"
import { CustomValidationMessage, LazyValue, ValidationError, ValidationSchema } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"
import { sanitizeArrayValues } from "../sanitizeArrayValues"
import { testArrayValues } from "../testArrayValues"
import { validateArrayValues } from "../validateArrayValues"

export class ArraySchema extends Schema {
  protected cloneInstance(): this {
    const schema = new ArraySchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.andSchemas = [...this.andSchemas]
    schema.orSchemas = [...this.orSchemas]
    schema.valuesSchema = this.valuesSchema

    return schema as any
  }

  protected async customTestingBehavior(value: any, testResult: boolean): Promise<boolean> {
    return testResult && await testArrayValues(value, this.valuesSchema)
  }

  protected async customSanitizeBehavior<T, M = T>(value: T): Promise<M> {
    return sanitizeArrayValues(value, this.valuesSchema)
  }

  protected async customValidationBehavior(value: any, errors: ValidationError[]): Promise<ValidationError[]> {
    const arrayValuesErrors = await validateArrayValues(value, this.valuesSchema)

    return [...errors, ...arrayValuesErrors]
  }

  protected valuesSchema?: ValidationSchema

  constructor(valuesSchema?: ValidationSchema) {
    super()

    this.skipClone(() => this.shape(valuesSchema))
  }

  required(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("array_optional")
      .addValidationDefinition(createValidationDefinition("array_required", arrayRequired, [], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("array_required")
      .addValidationDefinition(createValidationDefinition("array_optional", arrayOptional, [], message))
  }

  equals(equal: LazyValue<any[]>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("array_equals", arrayEquals, [equal], message))
  }

  length(exactLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("array_length", arrayLength, [exactLength], message))
  }

  min(minLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("array_min", arrayMin, [minLength], message))
  }

  max(maxLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("array_max", arrayMax, [maxLength], message))
  }

  between(minLength: LazyValue<number>, maxLength: LazyValue<number>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("array_between", arrayBetween, [minLength, maxLength], message))
  }

  someOf(whitelist: LazyValue<any[]>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("array_some_of", arraySomeOf, [whitelist], message))
  }

  noneOf(blacklist: LazyValue<any[]>, message?: CustomValidationMessage): this {
    return this.addValidationDefinition(createValidationDefinition("array_none_of", arrayNoneOf, [blacklist], message))
  }

  shape(valuesSchema?: ValidationSchema): this {
    const schema = this.clone()
    schema.valuesSchema = valuesSchema

    return schema
  }

  toDefault(defaultValue: LazyValue<any[]> = []): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(arrayToDefault, [defaultValue]))
  }

  toFiltered(filter: (value: any) => boolean): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(arrayToFiltered, [filter]))
  }

  toMapped(mapper: (value: any) => any): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(arrayToMapped, [mapper]))
  }

  toCompact(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(arrayToCompact))
  }

  toUnique(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(arrayToUnique))
  }
}