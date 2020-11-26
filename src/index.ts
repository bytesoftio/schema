import { StringSchema } from "./schemas/StringSchema"
import { NumberSchema } from "./schemas/NumberSchema"
import { BooleanSchema } from "./schemas/BooleanSchema"
import { DateSchema } from "./schemas/DateSchema"
import { ValidationSchema } from "./types"
import { ArraySchema } from "./schemas/ArraySchema"
import { ObjectSchema, ObjectShape } from "./schemas/ObjectSchema"
import { MixedSchema } from "./schemas/MixedSchema"

export const string = () => new StringSchema()
export const number = () => new NumberSchema()
export const boolean = () => new BooleanSchema()
export const date = () => new DateSchema()
export const array = (arrayShape?: ValidationSchema) => new ArraySchema(arrayShape)
export const object = <TValue extends object = any>(objectShape?: ObjectShape<TValue>) => new ObjectSchema<TValue>(objectShape)
export const mixed = () => new MixedSchema()
export const value = (defaultValue?: any) => {
  return {
    string: () => string().toDefault(defaultValue),
    number: () => number().toDefault(defaultValue),
    boolean: () => boolean().toDefault(defaultValue),
    date: () => date().toDefault(defaultValue),
    array: (arrayShape?: ValidationSchema) => array(arrayShape).toDefault(defaultValue),
    object: <TValue extends object= any>(objectShape?: ObjectShape<TValue>) => object<TValue>(objectShape).toDefault(defaultValue),
    mixed: () => mixed().toDefault(defaultValue),
  }
}

export * from "./schemas/StringSchema"
export * from "./schemas/NumberSchema"
export * from "./schemas/BooleanSchema"
export * from "./schemas/DateSchema"
export * from "./schemas/ArraySchema"
export * from "./schemas/ObjectSchema"
export * from "./schemas/MixedSchema"
export * from "./types"
export * from "./Schema"
export * from "./schemaTranslator"
export * from "./createValidationResult"
