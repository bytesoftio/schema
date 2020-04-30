import { includes } from "lodash"
import { LazyValue, ValidationFunctionResult } from "../types"
import { lazyValue } from "../lazyValue"

export const isDefined = (value: any) => value !== null && value !== undefined

export const mixedRequired = (value: any): ValidationFunctionResult => {
  return isDefined(value)
}

export const mixedOptional = (value: any): ValidationFunctionResult => {
  return
}

export const mixedEquals = (value: any, equal: LazyValue<any>): ValidationFunctionResult => {
  if ( ! isDefined(value)) return

  return value === lazyValue(equal)
}

export const mixedOneOf = (value: any, whitelist: LazyValue<(string | number | boolean)[]>): ValidationFunctionResult => {
  if ( ! isDefined(value)) return

  return includes(lazyValue(whitelist), value)
}

export const mixedNoneOf = (value: any, blacklist: LazyValue<(string | number | boolean)[]>): ValidationFunctionResult => {
  if ( ! isDefined(value)) return

  return ! includes(lazyValue(blacklist), value)
}

////////////////////////////////////////////////////////////////////////////////

export const mixedToDefault = (value: any, defaultValue: LazyValue<any>): number => {
  return value === null || value === undefined ? lazyValue(defaultValue) : value
}