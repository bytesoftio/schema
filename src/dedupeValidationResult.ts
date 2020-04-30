import { ValidationError } from "./types"
import { uniqBy } from "lodash"

export const dedupeValidationResult = (errors: ValidationError[]): ValidationError[] => {
  if (errors.length === 0) return errors

  return uniqBy(errors, error => `${error.type}${JSON.stringify(error.args)}${error.path}`)
}