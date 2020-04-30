import { camelCase, isEqual, isObjectLike, kebabCase, mapKeys, mapValues, snakeCase } from "lodash"
import { isDefined } from "./mixed"
import { mapKeysDeep, mapValuesDeep } from "../helpers"
import { LazyValue, ValidationFunctionResult } from "../types"
import { lazyValue } from "../lazyValue"

const isDefinedObject = (value: any) => isDefined(value) && isObjectLike(value)

export const objectRequired = (value: any): ValidationFunctionResult => {
  return isDefinedObject(value)
}

export const objectOptional = (value: any): ValidationFunctionResult => {
  if ( ! isDefined(value)) return

  return isObjectLike(value)
}

export const objectEquals = (value: any, equal: LazyValue<object>): ValidationFunctionResult => {
  if ( ! isDefinedObject(value)) return

  return isEqual(value, lazyValue(equal))
}

////////////////////////////////////////////////////////////////////////////////

export const objectToDefault = (value: any, defaultValue: LazyValue<object>): object => {
  return ! isObjectLike(value) ? lazyValue(defaultValue) : value
}

export const objectToCamelCaseKeys = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeys(value, (value, key) => camelCase(key))
}

export const objectToCamelCaseKeysDeep = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeysDeep(value, (value, key) => camelCase(key))
}

export const objectToKebabCaseKeys = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeys(value, (value, key) => kebabCase(key))
}

export const objectToKebabCaseKeysDeep = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeysDeep(value, (value, key) => kebabCase(key))
}

export const objectToSnakeCaseKeys = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeys(value, (value, key) => snakeCase(key))
}

export const objectToSnakeCaseKeysDeep = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeysDeep(value, (value, key) => snakeCase(key))
}

export const objectToConstantCaseKeys = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeys(value, (value, key) => snakeCase(key).toUpperCase())
}

export const objectToConstantCaseKeysDeep = (value: any) => {
  return ! isObjectLike(value) ? value : mapKeysDeep(value, (value, key) => snakeCase(key).toUpperCase())
}

export const objectToMappedValues = (value: any, mapper: (value: any, key: string) => any) => {
  return ! isObjectLike(value) ? value : mapValues(value, mapper)
}

export const objectTotMappedValuesDeep = (value: any, mapper: (value: any, key: string | number) => any) => {
  return ! isObjectLike(value) ? value : mapValuesDeep(value, mapper)
}

export const objectToMappedKeys = (value: any, mapper: (value: any, key: string) => any) => {
  return ! isObjectLike(value) ? value : mapKeys(value, mapper)
}

export const objectToMappedKeysDeep = (value: any, mapper: (value: any, key: string) => any) => {
  return ! isObjectLike(value) ? value : mapKeysDeep(value, mapper)
}