import {
  SanitizerDefinition,
  SanitizerFunction,
  ValidationDefinition,
  ValidationError,
  ValidationSchema,
  ValidationType,
  CustomValidation,
} from "./types"
import { createValidationDefinition } from "./createValidationDefinition"
import { createSanitizerDefinition } from "./createSanitizerDefinition"
import { sanitizeValue } from "./sanitizeValue"
import { testValueAsync } from "./testValueAsync"
import { validateValueAsync } from "./validateValueAsync"
import { testAndOrSchemas } from "./testAndOrSchemas"
import { validateAndOrSchemasAsync } from "./validateAndOrSchemasAsync"
import { dedupeValidationResult } from "./dedupeValidationResult"
import { sanitizeValueAsync } from "./sanitizeValueAsync"
import { testValue } from "./testValue"
import { testAndOrSchemasAsync } from "./testAndOrSchemasAsync"
import { validateValue } from "./validateValue"
import { validateAndOrSchemas } from "./validateAndOrSchemas"

export abstract class Schema<TValue> implements ValidationSchema<TValue> {
  protected abstract cloneInstance(): this

  protected immutableMode: boolean = true
  protected sanitizerDefinitions: SanitizerDefinition[] = []
  protected validationDefinitions: ValidationDefinition[] = []
  protected conditionalValidationDefinitions: ValidationDefinition[] = []

  or(orValidator: CustomValidation): this {
    return this.addConditionalValidationDefinition(createValidationDefinition("or", orValidator, [], ""))
  }

  and(andValidator: CustomValidation): this {
    return this.addConditionalValidationDefinition(createValidationDefinition("and", andValidator, [], ""))
  }

  also(validator: CustomValidation): this {
    return this.addValidationDefinition(createValidationDefinition("custom", validator, [], ""))
  }

  // alias for "also()"
  validator(validator: CustomValidation): this {
    return this.also(validator)
  }

  map(sanitizer: SanitizerFunction): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(sanitizer))
  }

  // alias for "map()"
  sanitizer(sanitizer: SanitizerFunction): this {
    return this.map(sanitizer)
  }

  test(value: any): boolean {
    const testResult = testValue(value, this.validationDefinitions)
    const customTestResult = this.customTestingBehavior(value, testResult)
    const testResultWithAndOr = testAndOrSchemas(value, customTestResult, this.conditionalValidationDefinitions)

    return testResultWithAndOr
  }

  async testAsync(value: any): Promise<boolean> {
    const testResult = await testValueAsync(value, this.validationDefinitions)
    const customTestResult = await this.customTestingBehaviorAsync(value, testResult)
    const testResultWithAndOr = await testAndOrSchemasAsync(value, customTestResult, this.conditionalValidationDefinitions)

    return testResultWithAndOr
  }

  validate(value: any, language?: string, fallbackLanguage?: string): ValidationError[] | undefined {
    const errors = validateValue(value, this.validationDefinitions, language, fallbackLanguage)
    const customErrors = this.customValidationBehavior(value, errors, language, fallbackLanguage)
    const errorsWithAndOr = validateAndOrSchemas(value, customErrors, this.conditionalValidationDefinitions, language, fallbackLanguage)
    const dedupedErrors = dedupeValidationResult(errorsWithAndOr)

    return ! dedupedErrors || dedupedErrors.length === 0 ? undefined : dedupedErrors
  }

  async validateAsync(value: any, language?: string, fallbackLanguage?: string): Promise<ValidationError[] | undefined> {
    const errors = await validateValueAsync(value, this.validationDefinitions, language, fallbackLanguage)
    const customErrors = await this.customValidationBehaviorAsync(value, errors, language, fallbackLanguage)
    const errorsWithAndOr = await validateAndOrSchemasAsync(value, customErrors, this.conditionalValidationDefinitions, language, fallbackLanguage)
    const dedupedErrors = dedupeValidationResult(errorsWithAndOr)

    return ! dedupedErrors || dedupedErrors.length === 0 ? undefined : dedupedErrors
  }

  sanitize<TValue, TSanitizedValue = TValue>(value: TValue): TSanitizedValue {
    const sanitizedValue = sanitizeValue<TValue, TSanitizedValue>(value, this.sanitizerDefinitions)
    const customSanitizedValue = this.customSanitizeBehavior<TValue, TSanitizedValue>(sanitizedValue as any)

    return customSanitizedValue
  }

  async sanitizeAsync<TValue, TSanitizedValue = TValue>(value: TValue): Promise<TSanitizedValue> {
    const sanitizedValue = await sanitizeValueAsync<TValue, TSanitizedValue>(value, this.sanitizerDefinitions)
    const customSanitizedValue = await this.customSanitizeBehaviorAsync<TValue, TSanitizedValue>(sanitizedValue as any)

    return customSanitizedValue
  }

  sanitizeAndTest<TValue, TSanitizedValue = TValue>(value: any): [boolean, TSanitizedValue] {
    const sanitizedValue = this.sanitize<TValue, TSanitizedValue>(value)
    const testResult = this.test(sanitizedValue)

    return [testResult, sanitizedValue]
  }

  async sanitizeAndTestAsync<TValue, TSanitizedValue = TValue>(value: any): Promise<[boolean, TSanitizedValue]> {
    const sanitizedValue = await this.sanitizeAsync<TValue, TSanitizedValue>(value)
    const testResult = await this.testAsync(sanitizedValue)

    return [testResult, sanitizedValue]
  }

  sanitizeAndValidate<TValue, TSanitizedValue = TValue>(value: any, language?: string, fallbackLanguage?: string): [ValidationError[] | undefined, TSanitizedValue] {
    const sanitizedValue = this.sanitize<TValue, TSanitizedValue>(value)
    const validationResult = this.validate(sanitizedValue, language, fallbackLanguage)

    return [validationResult, sanitizedValue]
  }

  async sanitizeAndValidateAsync<TValue, TSanitizedValue = TValue>(value: any, language?: string, fallbackLanguage?: string): Promise<[ValidationError[] | undefined, TSanitizedValue]> {
    const sanitizedValue = await this.sanitizeAsync<TValue, TSanitizedValue>(value)
    const validationResult = await this.validateAsync(sanitizedValue, language, fallbackLanguage)

    return [validationResult, sanitizedValue]
  }

  protected customTestingBehavior(value: any, testResult: boolean): boolean {
    return testResult
  }

  protected async customTestingBehaviorAsync(value: any, testResult: boolean): Promise<boolean> {
    return testResult
  }

  protected customValidationBehavior(value: any, errors: ValidationError[], language?: string, fallbackLanguage?: string): ValidationError[] {
    return errors
  }

  protected async customValidationBehaviorAsync(value: any, errors: ValidationError[], language?: string, fallbackLanguage?: string): Promise<ValidationError[]> {
    return errors
  }

  protected customSanitizeBehavior<TValue, TSanitizedValue = TValue>(value: TValue): TSanitizedValue {
    return value as any
  }

  protected async customSanitizeBehaviorAsync<TValue, TSanitizedValue = TValue>(value: TValue): Promise<TSanitizedValue> {
    return value as any
  }

  protected addValidationDefinition(validationDefinition: ValidationDefinition): this {
    let schema = this.clone()

    // do not remove custom validations, they all share the same key
    if (validationDefinition.type !== "custom") {
      schema = this.removeValidationDefinitionsOfType(validationDefinition.type)
    }

    schema.validationDefinitions.push(validationDefinition)

    return schema
  }

  protected addConditionalValidationDefinition(validationDefinition: ValidationDefinition): this {
    let schema = this.clone()
    schema.conditionalValidationDefinitions.push(validationDefinition)

    return schema
  }

  protected addSanitizerDefinition(sanitizerDefinition: SanitizerDefinition): this {
    const schema = this.clone()
    schema.sanitizerDefinitions.push(sanitizerDefinition)

    return schema
  }

  protected removeValidationDefinitionsOfType(type: ValidationType): this {
    const schema = this.clone()
    schema.validationDefinitions = this.validationDefinitions.filter(definition => definition.type !== type)

    return schema
  }

  protected clone(): this {
    if (this.immutableMode) {
      return this.cloneInstance()
    }

    return this
  }

  protected skipClone(fn: () => void): void {
    this.immutableMode = false
    fn()
    this.immutableMode = true
  }
}
