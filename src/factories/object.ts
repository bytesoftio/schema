import {
  ObjectSchema,
  ObjectShape,
} from ".."

export const object = <TValue extends object = any>(objectShape?: ObjectShape<TValue>) => new ObjectSchema<TValue>(objectShape)
