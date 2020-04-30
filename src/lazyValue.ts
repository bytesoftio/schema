import { LazyValue } from "./types"
import { isFunction } from "lodash"

export const lazyValue = <T>(value: LazyValue<T>): T => {
  return isFunction(value) ? value() : value as any
}