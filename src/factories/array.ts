import { ValidationSchema } from "../types"
import { ArraySchema } from ".."

export const array = (arrayShape?: ValidationSchema) => new ArraySchema(arrayShape)
