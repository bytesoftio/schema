import { locale } from "./locale"

export interface ValidationSchema<TValue = any> {
  required(message?: CustomValidationMessage): ValidationSchema
  optional(message?: CustomValidationMessage): ValidationSchema
  equals(value: any): ValidationSchema

  or(orSchema: LazyValue<ValidationSchema | undefined>): ValidationSchema
  and(andSchema: LazyValue<ValidationSchema | undefined>): ValidationSchema

  validator(validator: CustomValidationFunction): ValidationSchema
  sanitizer(sanitizer: SanitizerFunction): ValidationSchema

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
export type ValidationFunctionResult = undefined | boolean | string
export type ValidationError = {
  type: ValidationType
  message: string
  args: any[]
  value: any
  link: ValidationLink
  path: ValidationPath
}
export type ValidationFunction = (value: any, ...args: any[]) => MaybePromise<ValidationFunctionResult>
export type ValidationType = (keyof typeof locale) | "custom"
export type ValidationLink = "and" | "or" | string | undefined
export type ValidationPath = string | undefined
export type ValidationDefinition = {
  type: ValidationType
  validator: ValidationFunction
  args: any[]
  customMessage?: CustomValidationMessage
}
export type CustomValidationMessage = LazyValue<string>
export type CustomValidationResult = string | undefined
export type CustomValidationFunction = (value: any) => MaybePromise<CustomValidationResult>
export type SanitizerFunction = (value: any, ...args: any[]) => MaybePromise<any>
export type SanitizerDefinition = {
  sanitizer: SanitizerFunction,
  args: any[]
}
