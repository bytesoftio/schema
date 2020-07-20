import { Schema } from "../Schema"
import {
  objectEquals,
  objectOptional,
  objectRequired,
  objectToCamelCaseKeys, objectToCamelCaseKeysDeep,
  objectToConstantCaseKeys, objectToConstantCaseKeysDeep,
  objectToDefault,
  objectToKebabCaseKeys, objectToKebabCaseKeysDeep,
  objectToMappedKeys,
  objectToMappedKeysDeep,
  objectToMappedValues,
  objectToSnakeCaseKeys, objectToSnakeCaseKeysDeep,
  objectTotMappedValuesDeep,
} from "../assertions/object"
import { StringSchema } from "./StringSchema"
import { CustomValidationMessage, LazyValue, ValidationError, ValidationSchema } from "../types"
import { createValidationDefinition } from "../createValidationDefinition"
import { createSanitizerDefinition } from "../createSanitizerDefinition"
import { sanitizeObjectShape } from "../sanitizeObjectShape"
import { testObjectHasUnknownKeys } from "../testObjectHasUnknownKeys"
import { testObjectUnknownKeys } from "../testObjectUnknownKeys"
import { testObjectUnknownValues } from "../testObjectUnknownValues"
import { testObjectShape } from "../testObjectShape"
import { validateObjectHasUnknownKeys } from "../validateObjectHasUnknownKeys"
import { validateObjectUnknownKeys } from "../validateObjectUnknownKeys"
import { validateObjectUnknownValues } from "../validateObjectUnknownValues"
import { validateObjectShape } from "../validateObjectShape"
import { validateObjectIsMissingKeys } from "../validateObjectIsMissingKeys"
import { testObjectIsMissingKeys } from "../testObjectIsMissingKeys"

export type ObjectShape<TValue> = {
  [key in keyof TValue]: ValidationSchema
}

export class ObjectSchema<TValue> extends Schema {
  protected cloneInstance(): this {
    const schema = new ObjectSchema()
    schema.validationDefinitions = [...this.validationDefinitions]
    schema.sanitizerDefinitions = [...this.sanitizerDefinitions]
    schema.andSchemas = [...this.andSchemas]
    schema.orSchemas = [...this.orSchemas]
    schema.objectShape = this.objectShape
    schema.unknownKeysSchema = this.unknownKeysSchema
    schema.unknownValuesSchema = this.unknownValuesSchema
    schema.allowUnknownKeysAndValues = this.allowUnknownKeysAndValues

    return schema as any
  }

  protected async customTestingBehavior(value: any, testResult: boolean): Promise<boolean> {
    return testResult
      && testObjectHasUnknownKeys(value, this.objectShape, this.allowUnknownKeysAndValues)
      && testObjectIsMissingKeys(value, this.objectShape)
      && await testObjectUnknownKeys(value, this.objectShape, this.unknownKeysSchema)
      && await testObjectUnknownValues(value, this.objectShape, this.unknownValuesSchema)
      && await testObjectShape(value, this.objectShape)
  }

  protected async customValidationBehavior(value: any, errors: ValidationError[]): Promise<ValidationError[]> {
    const hasUnknownKeysErrors = validateObjectHasUnknownKeys(value, this.objectShape, this.allowUnknownKeysAndValues)
    const isMissingKeysErrors = validateObjectIsMissingKeys(value, this.objectShape)
    const unknownKeysErrors = await validateObjectUnknownKeys(value, this.objectShape, this.unknownKeysSchema)
    const unknownValueErrors = await validateObjectUnknownValues(value, this.objectShape, this.unknownValuesSchema)
    const validateShapeErrors = await validateObjectShape(value, this.objectShape)

    return [...errors, ...hasUnknownKeysErrors, ...isMissingKeysErrors, ...unknownKeysErrors, ...unknownValueErrors, ...validateShapeErrors]
  }

  protected async customSanitizeBehavior<TValue, TSanitizedValue = TValue>(value: TValue): Promise<TSanitizedValue> {
    return sanitizeObjectShape(value, this.objectShape)
  }

  protected objectShape?: ObjectShape<TValue>
  protected unknownKeysSchema?: StringSchema
  protected unknownValuesSchema?: StringSchema
  protected allowUnknownKeysAndValues: boolean = false

  constructor(objectShape?: ObjectShape<TValue>) {
    super()

    this.skipClone(() => {
      this.shape(objectShape).disallowUnknownKeys()
    })
  }

  required(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("object_optional")
      .addValidationDefinition(createValidationDefinition("object_required", objectRequired, [], message))
  }

  optional(message?: CustomValidationMessage): this {
    return this
      .removeValidationDefinitionsOfType("object_required")
      .addValidationDefinition(createValidationDefinition("object_optional", objectOptional, [], message))
  }

  equals(equal: LazyValue<object>, message?: CustomValidationMessage): this {
    return this.allowUnknownKeys()
      .addValidationDefinition(createValidationDefinition("object_equals", objectEquals, [equal], message))
  }

  shape(objectShape?: ObjectShape<TValue>): this {
    const schema = this.clone()
    schema.objectShape = objectShape

    return schema
  }

  allowUnknownKeys(): this {
    const schema = this.clone()
    schema.allowUnknownKeysAndValues = true

    return schema
  }

  disallowUnknownKeys(): this {
    const schema = this.clone()
    schema.allowUnknownKeysAndValues = false

    return schema
  }

  shapeUnknownKeys(unknownKeysSchema: StringSchema): this {
    const schema = this.clone()
    schema.unknownKeysSchema = unknownKeysSchema

    return schema.allowUnknownKeys()
  }

  shapeUnknownValues(unknownValuesSchema: StringSchema): this {
    const schema = this.clone()
    schema.unknownValuesSchema = unknownValuesSchema

    return schema.allowUnknownKeys()
  }

  toDefault(defaultValue: LazyValue<object> = {}): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToDefault, [defaultValue]))
  }

  toCamelCaseKeys(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToCamelCaseKeys))
  }

  toCamelCaseKeysDeep(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToCamelCaseKeysDeep))
  }

  toSnakeCaseKeys(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToSnakeCaseKeys))
  }

  toSnakeCaseKeysDeep(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToSnakeCaseKeysDeep))
  }

  toKebabCaseKeys(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToKebabCaseKeys))
  }

  toKebabCaseKeysDeep(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToKebabCaseKeysDeep))
  }

  toConstantCaseKeys(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToConstantCaseKeys))
  }

  toConstantCaseKeysDeep(): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToConstantCaseKeysDeep))
  }

  toMappedValues(mapper: (value: any, key: string) => any): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToMappedValues, [mapper]))
  }

  toMappedValuesDeep(mapper: (value: any, key: string | number) => any): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectTotMappedValuesDeep, [mapper]))
  }

  toMappedKeys(mapper: (value: any, key: string) => any): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToMappedKeys, [mapper]))
  }

  toMappedKeysDeep(mapper: (value: any, key: string) => any): this {
    return this.addSanitizerDefinition(createSanitizerDefinition(objectToMappedKeysDeep, [mapper]))
  }
}
