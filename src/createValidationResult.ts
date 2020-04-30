import { ValidationError, ValidationResult } from "./types"

export const createValidationResult = (errors: ValidationError[] | undefined): ValidationResult | undefined => {
  if ( ! errors) return

  const result: ValidationResult = {}

  errors.forEach(error => {
    const path = error.path || "self"
    const errorGroup = result[path] || []
    result[path] = [...errorGroup, error.message]
  })

  return result
}