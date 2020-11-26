import {
  CustomValidationMessage,
  SanitizerDefinition,
  SanitizerFunction,
  ValidationDefinition,
  ValidationError,
  ValidationSchema,
  ValidationType,
  CustomValidationFunction,
} from "./types"
import { createValidationDefinition } from "./createValidationDefinition"
import { createSanitizerDefinition } from "./createSanitizerDefinition"
import {
  sanitizeValue,

} from "./sanitizeValue"
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
  abstract required(message?: CustomValidationMessage): this
  abstract optional(message?: CustomValidationMessage): this
  abstract equals(value: any): this
  protected abstract cloneInstance(): this

  protected immutableMode: boolean = true
  protected validationDefinitions: ValidationDefinition[] = []
  protected sanitizerDefinitions: SanitizerDefinition[] = []
  protected orSchemas: ValidationSchema[] = []
  protected andSchemas: ValidationSchema[] = []

  constructor() {
    this.skipClone(() => this.required())
  }

  or(orSchema: ValidationSchema): this {
    const schema = this.clone()
    schema.orSchemas.push(orSchema)

    return schema
  }

  and(andSchema: ValidationSchema): this {
    const schema = this.clone()
    schema.andSchemas.push(andSchema)

    return schema
  }

  customValidator(message: CustomValidationMessage, validator: CustomValidationFunction): this {
    return this.addValidationDefinition(createValidationDefinition("custom", validator, [], message))
  }

  customSanitizer(sanitizer: SanitizerFunction): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(sanitizer))
  }

  test(value: any): boolean {
    const testResult = testValue(value, this.validationDefinitions)
    const customTestResult = this.customTestingBehavior(value, testResult)
    const testResultWithAndOr = testAndOrSchemas(value, customTestResult, this.andSchemas, this.orSchemas)

    return testResultWithAndOr
  }

  async testAsync(value: any): Promise<boolean> {
    const testResult = await testValueAsync(value, this.validationDefinitions)
    const customTestResult = await this.customTestingBehaviorAsync(value, testResult)
    const testResultWithAndOr = await testAndOrSchemasAsync(value, customTestResult, this.andSchemas, this.orSchemas)

    return testResultWithAndOr
  }

  validate(value: any): ValidationError[] | undefined {
    const errors = validateValue(value, this.validationDefinitions)
    const customErrors = this.customValidationBehavior(value, errors)
    const errorsWithAndOr = validateAndOrSchemas(value, this, customErrors, this.andSchemas, this.orSchemas)
    const dedupedErrors = dedupeValidationResult(errorsWithAndOr)

    return ! dedupedErrors || dedupedErrors.length === 0 ? undefined : dedupedErrors
  }

  async validateAsync(value: any): Promise<ValidationError[] | undefined> {
    const errors = await validateValueAsync(value, this.validationDefinitions)
    const customErrors = await this.customValidationBehaviorAsync(value, errors)
    const errorsWithAndOr = await validateAndOrSchemasAsync(value, this, customErrors, this.andSchemas, this.orSchemas)
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

  sanitizeAndValidate<TValue, TSanitizedValue = TValue>(value: any): [ValidationError[] | undefined, TSanitizedValue] {
    const sanitizedValue = this.sanitize<TValue, TSanitizedValue>(value)
    const validationResult = this.validate(sanitizedValue)

    return [validationResult, sanitizedValue]
  }

  async sanitizeAndValidateAsync<TValue, TSanitizedValue = TValue>(value: any): Promise<[ValidationError[] | undefined, TSanitizedValue]> {
    const sanitizedValue = await this.sanitizeAsync<TValue, TSanitizedValue>(value)
    const validationResult = await this.validateAsync(sanitizedValue)

    return [validationResult, sanitizedValue]
  }

  protected customTestingBehavior(value: any, testResult: boolean): boolean {
    return testResult
  }

  protected async customTestingBehaviorAsync(value: any, testResult: boolean): Promise<boolean> {
    return testResult
  }

  protected customValidationBehavior(value: any, errors: ValidationError[]): ValidationError[] {
    return errors
  }

  protected async customValidationBehaviorAsync(value: any, errors: ValidationError[]): Promise<ValidationError[]> {
    return errors
  }

  protected customSanitizeBehavior<TValue, TSanitizedValue = TValue>(value: TValue): TSanitizedValue {
    return value as any
  }

  protected async customSanitizeBehaviorAsync<TValue, TSanitizedValue = TValue>(value: TValue): Promise<TSanitizedValue> {
    return value as any
  }

  protected addValidationDefinition(validationDefinition: ValidationDefinition): this {
    const schema = this.removeValidationDefinitionsOfType(validationDefinition.type)
    schema.validationDefinitions.push(validationDefinition)

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
