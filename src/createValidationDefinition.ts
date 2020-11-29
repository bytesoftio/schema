import {
  CustomValidationMessage,
  LazyValue,
  ValidationDefinition,
  ValidationBlock,
  ValidationType,
} from "./types"

export const createValidationDefinition = (
  type: ValidationType,
  validator: ValidationBlock,
  args: LazyValue<any>[] = [],
  customMessage?: CustomValidationMessage,
): ValidationDefinition => {
  return { type, validator, args, customMessage }
}
