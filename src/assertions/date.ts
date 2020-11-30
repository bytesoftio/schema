import { isDefined } from "./mixed"
import { isAfter, isBefore, isDate, isSameDay } from "date-fns"
import { LazyValue, ValidationFunctionResult } from "../types"
import { lazyValue } from "../lazyValue"

const isDefinedDate = (value: any) => isDefined(value) && isDate(value)

export const dateRequired = (value: any): ValidationFunctionResult => {
  return isDefined(value) && isDate(value)
}

export const dateType = (value: any): ValidationFunctionResult => {
  if ( ! isDefined(value)) return

  return isDate(value)
}

export const dateEquals = (value: any, equal: LazyValue<Date>): ValidationFunctionResult => {
  if ( ! isDefinedDate(value)) return

  return isSameDay(value, lazyValue(equal))
}

export const dateAfter = (value: any, after: LazyValue<Date>): ValidationFunctionResult => {
  if ( ! isDefinedDate(value)) return

  return isAfter(value, lazyValue(after))
}

export const dateBefore = (value: any, before: LazyValue<Date>): ValidationFunctionResult => {
  if ( ! isDefinedDate(value)) return

  return isBefore(value, lazyValue(before))
}

export const dateBetween = (value: any, after: LazyValue<Date>, before: LazyValue<Date>): ValidationFunctionResult => {
  if ( ! isDefinedDate(value)) return

  return isAfter(value, lazyValue(after)) && isBefore(value, lazyValue(before))
}

////////////////////////////////////////////////////////////////////////////////

export const dateToDefault = (value: any, defaultValue: LazyValue<Date>): boolean => {
  return ! isDate(value) ? lazyValue(defaultValue) : value
}
