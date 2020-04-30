import { locale } from "./locale"

export interface ValidationSchema {
  required(message?: CustomValidationMessage): ValidationSchema
  optional(message?: CustomValidationMessage): ValidationSchema
  equals(value: any): ValidationSchema

  or(orSchema: ValidationSchema): ValidationSchema
  and(andSchema: ValidationSchema): ValidationSchema

  customValidator(message: string, validator: CustomValidationFunction): ValidationSchema
  customSanitizer(sanitizer: SanitizerFunction): ValidationSchema

  test(value: any): Promise<boolean>
  validate(value: any): Promise<ValidationError[] | undefined>
  sanitize<T, M = T>(value: T): Promise<M>
  sanitizeAndTest<T, M = T>(value: any): Promise<[boolean, T]>
  sanitizeAndValidate<T, M = T>(value: any): Promise<[ValidationError[] | undefined, T]>
}

export type LazyValue<T> = T | (() => T) | undefined
export type MaybePromise<T> = T | Promise<T>

export type ValidationResult = { [K: string]: string[] }
export type ValidationFunctionResult = undefined | boolean
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
export type CustomValidationFunction = (value: any) => MaybePromise<ValidationFunctionResult>
export type SanitizerFunction = (value: any, ...args: any[]) => MaybePromise<any>
export type SanitizerDefinition = {
  sanitizer: SanitizerFunction,
  args: any[]
}