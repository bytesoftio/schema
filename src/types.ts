import { locale } from "./locale"

export interface ValidationSchema<TValue = any> {
  required(message?: CustomValidationMessage): this
  optional(message?: CustomValidationMessage): this
  equals(value: any): this

  or(orSchema: CustomValidation): this
  and(andSchema: CustomValidation): this

  also(validator: CustomValidation): this
  // alias for "also()"
  validator(validator: CustomValidation): this

  map(sanitizer: SanitizerFunction): this
  // alias for "map()"
  sanitizer(sanitizer: SanitizerFunction): this

  test(value: any): boolean
  testAsync(value: any): Promise<boolean>
  validate(value: any): ValidationError[] | undefined
  validateAsync(value: any): Promise<ValidationError[] | undefined>
  sanitize<TValue, TSanitizedValue = TValue>(value: TValue): TSanitizedValue
  sanitizeAsync<TValue, TSanitizedValue = TValue>(value: TValue): Promise<TSanitizedValue>
  sanitizeAndTest<TValue, TSanitizedValue = TValue>(value: any): [boolean, TValue]
  sanitizeAndTestAsync<TValue, TSanitizedValue = TValue>(value: any): Promise<[boolean, TValue]>
  sanitizeAndValidate<TValue, TSanitizedValue = TValue>(value: any): [ValidationError[] | undefined, TValue]
  sanitizeAndValidateAsync<TValue, TSanitizedValue = TValue>(value: any): Promise<[ValidationError[] | undefined, TValue]>
}

export type LazyValue<TValue> = TValue | (() => TValue) | undefined
export type MaybePromise<TValue> = TValue | Promise<TValue>

export type ValidationResult = { [key: string]: string[] }
export type ValidationFunctionResult = undefined | boolean | string | ValidationSchema | ValidationError[]
export type ValidationError = {
  type: ValidationType
  message: string
  args: any[]
  value: any
  link: ValidationLink
  path: ValidationPath
}
export type ValidationBlock = ValidationSchema | ValidationFunction
export type ValidationFunction = (value: any, ...args: any[]) => MaybePromise<ValidationFunctionResult>
export type ValidationType = (keyof typeof locale) | "custom" | "and" | "or"
export type ValidationLink = "and" | "or" | string | undefined
export type ValidationPath = string | undefined
export type ValidationDefinition = {
  type: ValidationType
  validator: ValidationBlock
  args: any[]
  customMessage?: CustomValidationMessage
}
export type CustomValidationMessage = LazyValue<string>
export type CustomValidationResult = undefined | string | boolean | ValidationSchema | ValidationError[]
export type CustomValidation = ValidationSchema | ((value: any) => MaybePromise<CustomValidationResult>)
export type SanitizerFunction = (value: any, ...args: any[]) => MaybePromise<any>
export type SanitizerDefinition = {
  sanitizer: SanitizerFunction,
  args: any[]
}
