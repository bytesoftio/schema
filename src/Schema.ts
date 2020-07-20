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
import { sanitizeValue } from "./sanitizeValue"
import { testValue } from "./testValue"
import { validateValue } from "./validateValue"
import { testAndOrSchemas } from "./testAndOrSchemas"
import { validateAndOrSchemas } from "./validateAndOrSchemas"
import { dedupeValidationResult } from "./dedupeValidationResult"

export abstract class Schema implements ValidationSchema {
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

  async test(value: any): Promise<boolean> {
    const testResult = await testValue(value, this.validationDefinitions)
    const customTestResult = await this.customTestingBehavior(value, testResult)
    const testResultWithAndOr = await testAndOrSchemas(value, customTestResult, this.andSchemas, this.orSchemas)

    return testResultWithAndOr
  }

  async validate(value: any): Promise<ValidationError[] | undefined> {
    const errors = await validateValue(value, this.validationDefinitions)
    const customErrors = await this.customValidationBehavior(value, errors)
    const errorsWithAndOr = await validateAndOrSchemas(value, this, customErrors, this.andSchemas, this.orSchemas)
    const dedupedErrors = dedupeValidationResult(errorsWithAndOr)

    return ! dedupedErrors || dedupedErrors.length === 0 ? undefined : dedupedErrors
  }

  async sanitize<TValue, TSanitizedValue = TValue>(value: TValue): Promise<TSanitizedValue> {
    const sanitizedValue = await sanitizeValue<TValue, TSanitizedValue>(value, this.sanitizerDefinitions)
    const customSanitizedValue = await this.customSanitizeBehavior<TValue, TSanitizedValue>(sanitizedValue as any)

    return customSanitizedValue
  }

  async sanitizeAndTest<TValue, TSanitizedValue = TValue>(value: any): Promise<[boolean, TSanitizedValue]> {
    const sanitizedValue = await this.sanitize<TValue, TSanitizedValue>(value)
    const testResult = await this.test(sanitizedValue)

    return [testResult, sanitizedValue]
  }

  async sanitizeAndValidate<TValue, TSanitizedValue = TValue>(value: any): Promise<[ValidationError[] | undefined, TSanitizedValue]> {
    const sanitizedValue = await this.sanitize<TValue, TSanitizedValue>(value)
    const validationResult = await this.validate(sanitizedValue)

    return [validationResult, sanitizedValue]
  }

  protected async customTestingBehavior(value: any, testResult: boolean): Promise<boolean> {
    return testResult
  }

  protected async customValidationBehavior(value: any, errors: ValidationError[]): Promise<ValidationError[]> {
    return errors
  }

  protected async customSanitizeBehavior<TValue, TSanitizedValue = TValue>(value: TValue): Promise<TSanitizedValue> {
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
