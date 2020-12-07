import { isDefined } from "./mixed"
import { isBoolean } from "lodash"
import { LazyValue, ValidationFunctionResult } from "../types"
import { lazyValue } from "../lazyValue"

const isDefinedBoolean = (value: any) => isDefined(value) && isBoolean(value)

export const booleanRequired = (value: any, required?: LazyValue<boolean>): ValidationFunctionResult => {
  if (lazyValue(required) === false) return

  return isDefined(value) && isBoolean(value)
}

export const booleanType = (value: any): ValidationFunctionResult => {
  if ( ! isDefined(value)) return true

  return isBoolean(value)
}

export const booleanEquals = (value: any, equal: LazyValue<boolean>): ValidationFunctionResult => {
  if ( ! isDefinedBoolean(value)) return true

  return value === lazyValue(equal)
}

////////////////////////////////////////////////////////////////////////////////

export const booleanToDefault = (value: any, defaultValue: LazyValue<boolean>): boolean => {
  return ! isBoolean(value) ? lazyValue(defaultValue) : value
}
