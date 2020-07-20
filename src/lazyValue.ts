import { LazyValue } from "./types"
import { isFunction } from "lodash"

export const lazyValue = <TValue>(value: LazyValue<TValue>): TValue => {
  return isFunction(value) ? value() : value as any
}
