import { compact, difference, intersection, isArray, isEqual, sortBy, uniq } from "lodash"
import { isDefined } from "./mixed"
import { LazyValue, ValidationFunctionResult } from "../types"
import { lazyValue } from "../lazyValue"

const isDefinedArray = (value: any) => isDefined(value) && isArray(value)

export const arrayRequired = (value: any): ValidationFunctionResult => {
  return isDefined(value) && isArray(value)
}

export const arrayOptional = (value: any): ValidationFunctionResult => {
  if ( ! isDefined(value)) return

  return isArray(value)
}

export const arrayEquals = (value: any, equal: LazyValue<any[]>): ValidationFunctionResult => {
  if ( ! isDefinedArray(value)) return

  return isEqual(sortBy(value), sortBy(lazyValue(equal)))
}

export const arrayLength = (value: any, exactLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedArray(value)) return

  return value.length === lazyValue(exactLength)
}

export const arrayMin = (value: any, minLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedArray(value)) return

  return value.length >= lazyValue(minLength)
}

export const arrayMax = (value: any, maxLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedArray(value)) return

  return value.length <= lazyValue(maxLength)
}

export const arrayBetween = (value: any, minLength: LazyValue<number>, maxLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedArray(value)) return

  return value.length >= lazyValue(minLength) && value.length <= lazyValue(maxLength)
}

export const arraySomeOf = (value: any, whitelist: LazyValue<any[]>): ValidationFunctionResult => {
  if ( ! isDefinedArray(value)) return

  return difference(value, lazyValue(whitelist)).length === 0
}

export const arrayNoneOf = (value: any, blacklist: LazyValue<any[]>): ValidationFunctionResult => {
  if ( ! isDefinedArray(value)) return

  return intersection(value, lazyValue(blacklist)).length === 0
}

////////////////////////////////////////////////////////////////////////////////

export const arrayToDefault = (value: any, defaultValue: LazyValue<any[]>): any[] => {
  return ! isArray(value) ? lazyValue(defaultValue) : value
}

export const arrayToFiltered = (value: any, filter: (value: any) => boolean) => {
  return ! isArray(value) ? value : value.filter((v) => filter(v))
}

export const arrayToMapped = (value: any, mapper: (value: any) => any) => {
  return ! isArray(value) ? value : value.map((v) => mapper(v))
}

export const arrayToCompact = (value: any) => {
  return ! isArray(value) ? value : compact(value)
}

export const arrayToUnique = (value: any) => {
  return ! isArray(value) ? value : uniq(value)
}
