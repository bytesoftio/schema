import {
  CustomValidationMessage,
  LazyValue,
  ValidationDefinition,
  ValidationFunction,
  ValidationType,
} from "./types"

export const createValidationDefinition = (
  type: ValidationType,
  validator: ValidationFunction,
  args: LazyValue<any>[] = [],
  customMessage?: CustomValidationMessage,
): ValidationDefinition => {
  return { type, validator, args, customMessage }
}