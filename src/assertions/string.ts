import {
  camelCase,
  capitalize,
  endsWith,
  includes,
  isEmpty,
  isNumber,
  isString,
  kebabCase,
  snakeCase,
  startsWith,
  trim,
} from "lodash"
import { isDefined } from "./mixed"
import {
  format,
  isAfter,
  isBefore,
  isDate,
  isSameSecond,
  parseISO,
} from "date-fns"
import { LazyValue, ValidationFunctionResult } from "../types"
import { lazyValue } from "../lazyValue"

const isDefinedString = (value: any) => isDefined(value) && isString(value)
const isDefinedNonEmptyString = (value: any) => isDefined(value) && isString(value) && value.length > 0
const isNumeric = (value: any) => isNumber(value) || ( ! isEmpty(value) && ! isNaN(value))

export const stringRequired = (value: any): ValidationFunctionResult => {
  return isDefinedNonEmptyString(value)
}

export const stringType = (value: any): ValidationFunctionResult => {
  if ( ! isDefined(value)) return

  return isString(value)
}

export const stringEquals = (value: any, equal: LazyValue<string>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return value === lazyValue(equal)
}

export const stringLength = (value: any, exactLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return value.length === lazyValue(exactLength)
}

export const stringMin = (value: any, minLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return value.length >= lazyValue(minLength)
}

export const stringMax = (value: any, maxLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return value.length <= lazyValue(maxLength)
}

export const stringBetween = (value: any, minLength: LazyValue<number>, maxLength: LazyValue<number>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return value.length >= lazyValue(minLength) && value.length <= lazyValue(maxLength)
}

export const stringMatches = (value: any, regex: LazyValue<RegExp>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return lazyValue(regex).test(value)
}

let emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i

export const stringEmail = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedNonEmptyString(value)) return

  return emailRegex.test(value)
}

let urlRegex = /^((https?|ftp):)?\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i

export const stringUrl = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedNonEmptyString(value)) return

  return urlRegex.test(value)
}

export const stringStartsWith = (value: any, find: LazyValue<string>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return startsWith(value, lazyValue(find))
}

export const stringEndsWith = (value: any, find: LazyValue<string>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return endsWith(value, lazyValue(find))
}

export const stringIncludes = (value: any, find: LazyValue<string>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return includes(value, lazyValue(find))
}

export const stringOmits = (value: any, find: LazyValue<string>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return ! includes(value, lazyValue(find))
}

export const stringOneOf = (value: any, whitelist: LazyValue<string[]>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return includes(lazyValue(whitelist), value)
}

export const stringNoneOf = (value: any, blacklist: LazyValue<string[]>): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return ! includes(lazyValue(blacklist), value)
}

export const stringNumeric = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return isNumeric(value)
}

const alphaRegex = /^[a-zA-Z]+$/

export const stringAlpha = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return alphaRegex.test(value)
}

const alphaNumericRegex = /^[0-9a-zA-Z]+$/

export const stringAlphaNumeric = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return alphaNumericRegex.test(value)
}

const alphaDashes = /^[a-zA-Z-]+$/

export const stringAlphaDashes = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return alphaDashes.test(value)
}

const alphaUnderscores = /^[a-zA-Z_]+$/

export const stringAlphaUnderscores = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return alphaUnderscores.test(value)
}

const alphaNumericDashes = /^[0-9a-zA-Z-]+$/

export const stringAlphaNumericDashes = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return alphaNumericDashes.test(value)
}

const alphaNumericUnderscores = /^[0-9a-zA-Z_]+$/

export const stringAlphaNumericUnderscores = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return alphaNumericUnderscores.test(value)
}

const dateRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/

export const stringDate = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return dateRegex.test(value)
}

const timeRegex = /^(2[0-3]|[01][0-9]):([0-5][0-9]):?([0-5][0-9])?(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/

export const stringTime = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return timeRegex.test(value)
}

const dateTimeRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(\.[0-9]+)?(Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/

export const stringDateTime = (value: any): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return dateTimeRegex.test(value)
}

export const stringDateAfter = (value: any, after: LazyValue<Date>, allowSame: boolean): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  const date = parseISO(value)

  return isDate(date) && (isAfter(date, lazyValue(after)) || allowSame && isSameSecond(date, lazyValue(after)))
}

export const stringDateBefore = (value: any, before: LazyValue<Date>, allowSame: boolean): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  const date = parseISO(value)

  return isDate(date) && (isBefore(date, lazyValue(before)) || allowSame && isSameSecond(date, lazyValue(before)))
}

export const stringDateBetween = (value: any, after: LazyValue<Date>, before: LazyValue<Date>, allowSame: boolean): ValidationFunctionResult => {
  return stringDateAfter(value, after, allowSame) && stringDateBefore(value, before, allowSame)
}

export const stringTimeAfter = (value: any, after: LazyValue<string>, allowSame: boolean): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return
  if ( ! stringTime(value)) return false

  const date = parseISO(`${format(new Date(), "yyyy-MM-dd")}T${value}`)
  const dateAfter = parseISO(`${format(new Date(), "yyyy-MM-dd")}T${lazyValue(after)}`)

  return isDate(date) && isDate(dateAfter) && (isAfter(date, dateAfter) || allowSame && isSameSecond(date, lazyValue(dateAfter)))
}

export const stringTimeBefore = (value: any, before: LazyValue<string>, allowSame: boolean): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return
  if ( ! stringTime(value)) return false

  const date = parseISO(`${format(new Date(), "yyyy-MM-dd")}T${value}`)
  const dateBefore = parseISO(`${format(new Date(), "yyyy-MM-dd")}T${lazyValue(before)}`)

  return isDate(date) && isDate(dateBefore) && (isBefore(date, dateBefore) || allowSame && isSameSecond(date, lazyValue(dateBefore)))
}

export const stringTimeBetween = (value: any, after: LazyValue<string>, before: LazyValue<string>, allowSame: boolean): ValidationFunctionResult => {
  if ( ! isDefinedString(value)) return

  return stringTimeAfter(value, after, allowSame) && stringTimeBefore(value, before, allowSame)
}

////////////////////////////////////////////////////////////////////////////////

export const stringToDefault = (value: any, defaultValue: LazyValue<string>): string => {
  return ! isString(value) ? lazyValue(defaultValue) : value
}

export const stringToUpperCase = (value: any): string => {
  return isString(value) ? value.toUpperCase() : value
}

export const stringToLowerCase = (value: any): string => {
  return isString(value) ? value.toLowerCase() : value
}

export const stringToCapitalized = (value: any): string => {
  return isString(value) ? capitalize(value) : value
}

export const stringToCamelCase = (value: any): string => {
  return isString(value) ? camelCase(value) : value
}

export const stringToSnakeCase = (value: any): string => {
  return isString(value) ? snakeCase(value) : value
}

export const stringToKebabCase = (value: any): string => {
  return isString(value) ? kebabCase(value) : value
}

export const stringToConstantCase = (value: any): string => {
  return isString(value) ? snakeCase(value).toUpperCase() : value
}

export const stringToTrimmed = (value: any): string => {
  return isString(value) ? trim(value) : value
}
