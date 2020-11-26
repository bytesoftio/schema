import {
  ValidationError,
  ValidationLink,
} from "./types"
import { joinPath } from "./helpers"

export const linkErrors = (link: ValidationLink, errors: ValidationError[]): ValidationError[] => {
  errors.forEach(error => error.link = joinPath(link, error.link))

  return errors
}
