import { array, object, string } from "../index"
import { isString, keys } from "lodash"
import { translateMessage } from "../translateMessage"

describe("ObjectSchema", () => {
  test("required", async () => {
    const s1 = object()
    const s2 = object().required()

    expect(await s1.test(null)).toBe(false)
    expect(await s2.test(null)).toBe(false)
    expect(await s1.test(undefined)).toBe(false)
    expect(await s2.test(undefined)).toBe(false)
    expect(await s1.test(1)).toBe(false)
    expect(await s2.test(1)).toBe(false)
    expect(await s1.test({})).toBe(true)
    expect(await s2.test({})).toBe(true)

    const errors = (await s1.validate(null))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("object_required"))

    expect(await s1.validate({})).toBe(undefined)
  })

  test("optional", async () => {
    const s = object().optional()

    expect(await s.test(null)).toBe(true)
    expect(await s.test(undefined)).toBe(true)
    expect(await s.test(1)).toBe(false)
    expect(await s.test({})).toBe(true)

    const errors = (await s.validate(1))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("object_optional"))

    expect(await s.validate(null)).toBe(undefined)
    expect(await s.validate({})).toBe(undefined)
  })

  test("equals", async () => {
    const equals = { tag: "bar", baz: [1, 2] }
    const s1 = object().equals(equals)

    expect(await s1.test({ tag: "baz", baz: [1, 2] })).toBe(false)
    expect(await s1.test({ tag: "bar", baz: [1] })).toBe(false)
    expect(await s1.test(equals)).toBe(true)

    const errors = (await s1.validate({ tag: "baz" }))!
    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("object_equals", [equals]))
    expect(errors[0].path).toBe(undefined)

    expect(await s1.validate(equals)).toBe(undefined)

    const s2 = object().equals(() => equals)

    expect(await s2.test(equals)).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const newObject = { foo: "bar" }
    const s1 = object().toDefault(newObject)
    const otherObject = { bar: "baz" }

    expect(await s1.sanitize(null)).toBe(newObject)
    expect(await s1.sanitize(undefined)).toBe(newObject)
    expect(await s1.sanitize(1)).toBe(newObject)
    expect(await s1.sanitize(otherObject)).toBe(otherObject)

    const s2 = object().toDefault(() => newObject)

    expect(await s2.sanitize(null)).toBe(newObject)
  })

  test("toCamelCaseKeys", async () => {
    const s = object().toCamelCaseKeys()

    expect(await s.sanitize({ foo_bar: { yolo_swag: "here" } })).toEqual({ fooBar: { yolo_swag: "here" } })
  })

  test("toCamelCaseKeysDeep", async () => {
    const s = object().toCamelCaseKeysDeep()

    expect(await s.sanitize({ foo_bar: { yolo_swag: "here" } })).toEqual({ fooBar: { yoloSwag: "here" } })
  })

  test("toSnakeCaseKeys", async () => {
    const s = object().toSnakeCaseKeys()

    expect(await s.sanitize({ fooBar: { yoloSwag: "here" } })).toEqual({ foo_bar: { yoloSwag: "here" } })
  })

  test("toSnakeCaseKeysDeep", async () => {
    const s = object().toSnakeCaseKeysDeep()

    expect(await s.sanitize({ fooBar: { yoloSwag: "here" } })).toEqual({ foo_bar: { yolo_swag: "here" } })
  })

  test("toKebabCaseKeys", async () => {
    const s = object().toKebabCaseKeys()

    expect(await s.sanitize({ foo_bar: { yolo_swag: "here" } })).toEqual({ "foo-bar": { yolo_swag: "here" } })
  })

  test("toKebabCaseKeysDeep", async () => {
    const s = object().toKebabCaseKeysDeep()

    expect(await s.sanitize({ foo_bar: { yolo_swag: "here" } })).toEqual({ "foo-bar": { "yolo-swag": "here" } })
  })

  test("toConstantCaseKeys", async () => {
    const s = object().toConstantCaseKeys()

    expect(await s.sanitize({ fooBar: { yoloSwag: "here" } })).toEqual({ FOO_BAR: { yoloSwag: "here" } })
  })

  test("toConstantCaseKeysDeep", async () => {
    const s = object().toConstantCaseKeysDeep()

    expect(await s.sanitize({ fooBar: { yoloSwag: "here" } })).toEqual({ FOO_BAR: { YOLO_SWAG: "here" } })
  })

  test("toMappedKeys", async () => {
    const s = object().toMappedKeys((value, key) => `${key}_`)

    expect(await s.sanitize({ foo: { bar: "baz" }, yolo: "swag" })).toEqual({ foo_: { bar: "baz" }, yolo_: "swag" })
  })

  test("toMappedValues", async () => {
    const s = object().toMappedValues((value, key) => isString(value) ? `${value}_` : value)

    expect(await s.sanitize({ foo: { bar: "baz" }, yolo: "swag" })).toEqual({ foo: { bar: "baz" }, yolo: "swag_" })
  })

  test("toMappedKeysDeep", async () => {
    const s = object().toMappedKeysDeep((value, key) => `${key}_`)

    expect(await s.sanitize({ foo: { bar: "baz" }, yolo: "swag" })).toEqual({ foo_: { bar_: "baz" }, yolo_: "swag" })
  })

  test("toMappedValues", async () => {
    const s = object().toMappedValues((value, key) => isString(value) ? `${value}_` : value)

    expect(await s.sanitize({ foo: { bar: "baz" }, yolo: "swag" })).toEqual({ foo: { bar: "baz" }, yolo: "swag_" })
  })

  test("toMappedValuesDeep", async () => {
    const s = object().toMappedValuesDeep((value, key) => isString(value) ? `${value}_` : value)

    expect(await s.sanitize({ foo: { bar: "baz" }, yolo: "swag" })).toEqual({ foo: { bar: "baz_" }, yolo: "swag_" })
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("or", async () => {
    const s1 = object({
      foo: string().min(3).or(string().min(2)),
    }).or(object({
      bar: string().min(3).or(string().min(2)),
    }))

    expect(await s1.test({ foo: "1" })).toBe(false)
    expect(await s1.test({ foo: "12" })).toBe(true)
    expect(await s1.test({ foo: "123" })).toBe(true)
    expect(await s1.test({ bar: "1" })).toBe(false)
    expect(await s1.test({ bar: "12" })).toBe(true)
    expect(await s1.test({ bar: "123" })).toBe(true)

    const errors1 = (await s1.validate({ foo: "1" }))!

    expect(errors1.length).toBe(5)
    expect(errors1[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors1[0].path).toBe("foo")
    expect(errors1[0].link).toBe(undefined)
    expect(errors1[1].message).toBe(translateMessage("string_min", [2]))
    expect(errors1[1].path).toBe("foo")
    expect(errors1[1].link).toBe("or")
    expect(errors1[2].message).toBe(translateMessage("object_unknown_key", ["foo"]))
    expect(errors1[2].path).toBe(undefined)
    expect(errors1[2].link).toBe("or")
    expect(errors1[3].message).toBe(translateMessage("object_missing_key", ["bar"]))
    expect(errors1[3].path).toBe(undefined)
    expect(errors1[3].link).toBe("or")
    expect(errors1[4].message).toBe(translateMessage("string_required"))
    expect(errors1[4].path).toBe("bar")
    expect(errors1[4].link).toBe("or")

    expect(await s1.validate({ foo: "123" })).toBe(undefined)
    expect(await s1.validate({ bar: "123" })).toBe(undefined)

    const s2 = object().shapeUnknownKeys(string().min(3).or(string().min(2)))

    expect(await s2.test({ f: "1" })).toBe(false)
    expect(await s2.test({ fo: "12" })).toBe(true)
    expect(await s2.test({ foo: "123" })).toBe(true)

    const errors2 = (await s2.validate({ f: "1" }))!

    expect(errors2.length).toBe(2)
    expect(errors2[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors2[0].path).toBe("f")
    expect(errors2[0].link).toBe(undefined)
    expect(errors2[1].message).toBe(translateMessage("string_min", [2]))
    expect(errors2[1].path).toBe("f")
    expect(errors2[1].link).toBe("or")

    const s3 = object().shapeUnknownValues(string().min(3).or(string().min(2)))

    expect(await s3.test({ foo: "1" })).toBe(false)
    expect(await s3.test({ foo: "12" })).toBe(true)
    expect(await s3.test({ foo: "123" })).toBe(true)

    const errors3 = (await s3.validate({ foo: "1" }))!

    expect(errors3.length).toBe(2)
    expect(errors3[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors3[0].path).toBe("foo")
    expect(errors3[0].link).toBe(undefined)
    expect(errors3[1].message).toBe(translateMessage("string_min", [2]))
    expect(errors3[1].path).toBe("foo")
    expect(errors3[1].link).toBe("or")

    expect(await s3.validate({ foo: "12" })).toBe(undefined)
    expect(await s3.validate({ foo: "123" })).toBe(undefined)
  })

  test("and", async () => {
    const s = object({
      foo: string().min(2),
    })
      .and(object({
        foo: string().min(3)
          .and(string().min(4)),
      }))

    expect(await s.test({ foo: "1" })).toBe(false)
    expect(await s.test({ foo: "12" })).toBe(false)
    expect(await s.test({ foo: "123" })).toBe(false)
    expect(await s.test({ foo: "1234" })).toBe(true)

    const errors = (await s.validate({ foo: "1" }))!

    expect(errors.length).toBe(3)
    expect(errors[0].message).toBe(translateMessage("string_min", [2]))
    expect(errors[0].path).toBe("foo")
    expect(errors[0].link).toBe(undefined)
    expect(errors[1].message).toBe(translateMessage("string_min", [3]))
    expect(errors[1].path).toBe("foo")
    expect(errors[1].link).toBe("and")
    expect(errors[2].message).toBe(translateMessage("string_min", [4]))
    expect(errors[2].path).toBe("foo")
    expect(errors[2].link).toBe("and.and")

    expect(await s.validate({ foo: "1234" })).toBe(undefined)
  })

  test("disallowUnknownKeys", async () => {
    const s1 = object({ foo: string() })

    expect(await s1.test({ foo: "bar" })).toBe(true)
    expect(await s1.test({ yolo: "swag" })).toBe(false)
    expect(await s1.test({ foo: "bar", yolo: "swag" })).toBe(false)

    const s2 = object({ foo: string() }).disallowUnknownKeys()

    expect(await s2.test({ foo: "bar" })).toBe(true)
    expect(await s2.test({ yolo: "swag" })).toBe(false)
    expect(await s2.test({ foo: "bar", yolo: "swag" })).toBe(false)

    const errors = (await s2.validate({ foo: "bar", yolo: "swag" }))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("object_unknown_key", ["yolo"]))
    expect(errors[0].path).toBe(undefined)

    expect(await s2.validate({ foo: "bar" })).toBe(undefined)
  })

  test("allowUnknownKeys", async () => {
    const s = object({ foo: string() }).allowUnknownKeys()

    expect(await s.test({ foo: "bar" })).toBe(true)
    expect(await s.test({ foo: "bar", yolo: "swag" })).toBe(true)
    expect(await s.test({ yolo: "swag" })).toBe(false)

    const errors = (await s.validate({ foo: 1, yolo: "swag" }))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("string_required"))

    expect(await s.validate({ foo: "bar", yolo: "swag" })).toBe(undefined)
  })

  test("shapeUnknownKeys", async () => {
    const s = object().shapeUnknownKeys(string().min(3))

    expect(await s.test({ foo: "bar", yo: "swag" })).toBe(false)
    expect(await s.test({ foo: "bar", yolo: "swag" })).toBe(true)

    const errors = (await s.validate({ foo: "bar", yo: "swag" }))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors[0].path).toBe("yo")

    expect(await s.validate({ foo: "bar", yolo: "swag" })).toBe(undefined)
  })

  test("shapeUnknownValues", async () => {
    const s = object().shapeUnknownValues(string().min(3))

    expect(await s.test({ foo: "bar", yolo: "sw" })).toBe(false)
    expect(await s.test({ foo: "bar", yolo: "swag" })).toBe(true)

    const errors = (await s.validate({ foo: "bar", yolo: "sw" }))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors[0].path).toBe("yolo")

    expect(await s.validate({ foo: "bar", yolo: "swag" })).toBe(undefined)
  })

  test("shape", async () => {
    const s1 = object({ tag: string().min(2) })

    expect(await s1.test({})).toBe(false)
    expect(await s1.test({ bar: "12" })).toBe(false)
    expect(await s1.test({ tag: "1" })).toBe(false)
    expect(await s1.test({ tag: "12" })).toBe(true)

    const errors1 = (await s1.validate({ tag: "1" }))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("string_min", [2]))
    expect(errors1[0].path).toBe("tag")
    expect(errors1[0].value).toBe("1")

    expect(await s1.validate({ tag: "12" })).toBe(undefined)

    const s2 = object().shape({
      tag: string().oneOf(["foo", "bar"]),
      keys: array().someOf(["yolo", "swag"]),
    })

    expect(await s2.test({
      tag: "yolo",
      keys: [],
    })).toBe(false)

    expect(await s2.test({
      tag: "bar",
      keys: ["baz"],
    })).toBe(false)

    expect(await s2.test({
      tag: "bar",
      keys: ["yolo"],
    })).toBe(true)

    const errors2 = (await s2.validate({ tag: "yolo" }))!

    expect(errors2.length).toBe(3)
    expect(errors2[0].message).toBe(translateMessage("object_missing_key", ["keys"]))
    expect(errors2[0].path).toBe(undefined)
    expect(errors2[1].message).toBe(translateMessage("string_one_of", [["foo", "bar"]]))
    expect(errors2[1].path).toBe("tag")
    expect(errors2[2].message).toBe(translateMessage("array_required"))
    expect(errors2[2].path).toBe("keys")

    expect(await s2.validate({ tag: "foo", keys: ["yolo"] })).toBe(undefined)

    const s3 = object({
      foo: object({
        bar: string().min(3),
      }),
    })

    expect(await s3.test({})).toBe(false)
    expect(await s3.test({ foo: "123" })).toBe(false)
    expect(await s3.test({ foo: {} })).toBe(false)
    expect(await s3.test({ foo: { boo: "123" } })).toBe(false)
    expect(await s3.test({ foo: { bar: "12" } })).toBe(false)
    expect(await s3.test({ foo: { bar: "123" } })).toBe(true)

    const errors3 = (await s3.validate(null))!

    expect(errors3.length).toBe(5)
    expect(errors3[0].message).toBe(translateMessage("object_required"))
    expect(errors3[0].path).toBe(undefined)
    expect(errors3[1].message).toBe(translateMessage("object_missing_key", ["foo"]))
    expect(errors3[1].path).toBe(undefined)
    expect(errors3[2].message).toBe(translateMessage("object_required"))
    expect(errors3[2].path).toBe("foo")
    expect(errors3[3].message).toBe(translateMessage("object_missing_key", ["bar"]))
    expect(errors3[3].path).toBe("foo")
    expect(errors3[4].message).toBe(translateMessage("string_required"))
    expect(errors3[4].path).toBe("foo.bar")

    expect(await s3.validate({ foo: { bar: "123" } })).toBe(undefined)
  })

  test("customValidation", async () => {
    const s1 = string()
      .customValidator("is too short", (value) => value.length > 2)
    const s2 = object({ foo: s1 }).allowUnknownKeys()
      .customValidator("not enough keys", (value) => keys(value).length > 1)

    expect(await s2.test({ foo: "12" })).toBe(false)
    expect(await s2.test({ foo: "123" })).toBe(false)
    expect(await s2.test({ foo: "1234", bar: "123" })).toBe(true)
  })

  test("customSanitizer", async () => {
    const s = object({
      foo: string().customSanitizer(value => value.toString()),
    })

    expect(await s.sanitize({ foo: 1 })).toEqual({ foo: "1" })
  })

  test("sanitize", async () => {
    const s = object({ foo: string().length(2).toTrimmed() })

    expect(await s.sanitize({ foo: " 12 " })).toEqual({ foo: "12" })
  })

  test("sanitizeAndTest", async () => {
    const s = object({ foo: string().length(2).toTrimmed() })

    expect(await s.sanitizeAndTest({ foo: " 12 " })).toEqual([true, { foo: "12" }])
  })

  test("validate", async () => {
    const s = object({ foo: string().length(2) })
    const errors = (await s.validate({ foo: "1" }))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("string_length", [2]))
    expect(errors[0].path).toBe("foo")

    expect(await s.validate({ foo: "12" })).toBe(undefined)
  })

  test("sanitizeAndValidate", async () => {
    const s = object({ foo: string().length(2).toTrimmed() })
    const [errors1, value1] = await s.sanitizeAndValidate({ foo: "  1  " })

    expect(errors1!.length).toBe(1)
    expect(errors1![0].message).toBe(translateMessage("string_length", [2]))
    expect(errors1![0].path).toBe("foo")
    expect(value1).toEqual({ foo: "1" })

    const [errors2, value2] = await s.sanitizeAndValidate({ foo: "  12  " })
    expect(errors2).toBe(undefined)
    expect(value2).toEqual({ foo: "12" })
  })
})