import {
  ArraySchema,

} from "../index"
import { isString } from "lodash"
import { translateMessage } from "../translateMessage"
import { string } from "../factories/string"
import { number } from "../factories/number"
import { boolean } from "../factories/boolean"
import { array } from "../factories/array"
import { value } from "../factories/value"

describe("ArraySchema", () => {
  test("required", async () => {
    const s1 = array()
    const s2 = array().required()

    expect(await s1.testAsync(null)).toBe(false)
    expect(await s2.testAsync(null)).toBe(false)
    expect(await s1.testAsync(undefined)).toBe(false)
    expect(await s2.testAsync(undefined)).toBe(false)
    expect(await s1.testAsync(1)).toBe(false)
    expect(await s2.testAsync(1)).toBe(false)
    expect(await s1.testAsync([])).toBe(true)
    expect(await s2.testAsync([])).toBe(true)

    const errors1 = (await s1.validateAsync(null))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("array_required"))

    const errors2 = (await s1.validateAsync("array"))!

    expect(errors2.length).toBe(2)
    expect(errors2[0].message).toBe(translateMessage("array_type"))
    expect(errors2[1].message).toBe(translateMessage("array_required"))

    expect(await s1.validateAsync([])).toBe(undefined)
  })

  test("optional", async () => {
    const s = array().optional()

    expect(await s.testAsync(null)).toBe(true)
    expect(await s.testAsync(undefined)).toBe(true)
    expect(await s.testAsync(1)).toBe(false)
    expect(await s.testAsync([])).toBe(true)

    const errors1 = (await s.validateAsync("a"))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("array_type"))

    expect(await s.validateAsync([])).toBe(undefined)
    expect(await s.validateAsync(null)).toBe(undefined)
  })

  test("equals", async () => {
    const arg = [1, 2]
    const s1 = array().equals(arg)

    expect(await s1.testAsync([1, 2, 3])).toBe(false)
    expect(await s1.testAsync([2, 1])).toBe(true)
    expect(await s1.testAsync(arg)).toBe(true)

    expect((await s1.validateAsync([]))![0].message).toBe(translateMessage("array_equals", [arg]))
    expect(await s1.validateAsync(arg)).toBe(undefined)

    const s2 = array().equals(() => arg)

    expect(await s2.testAsync(arg)).toBe(true)
  })

  test("length", async () => {
    const arg = 3
    const s1 = array().length(arg)

    expect(await s1.testAsync([1, 2])).toBe(false)
    expect(await s1.testAsync([1, 2, 3, 4])).toBe(false)
    expect(await s1.testAsync([1, 2, 3])).toBe(true)

    expect((await s1.validateAsync([]))![0].message).toBe(translateMessage("array_length", [arg]))
    expect(await s1.validateAsync([1, 2, 3])).toBe(undefined)

    const s2 = array().length(() => arg)

    expect(await s2.testAsync([1, 2, 3])).toBe(true)
  })

  test("min", async () => {
    const arg = 2
    const s1 = array().min(arg)

    expect(await s1.testAsync([1])).toBe(false)
    expect(await s1.testAsync([1, 2])).toBe(true)

    expect((await s1.validateAsync([]))![0].message).toBe(translateMessage("array_min", [arg]))
    expect(await s1.validateAsync([1, 2])).toBe(undefined)

    const s2 = array().min(() => arg)

    expect(await s2.testAsync([1, 2])).toBe(true)
  })

  test("max", async () => {
    const arg = 2
    const s1 = array().max(arg)

    expect(await s1.testAsync([1, 2, 3])).toBe(false)
    expect(await s1.testAsync([1, 2])).toBe(true)
    expect(await s1.testAsync([1])).toBe(true)

    expect((await s1.validateAsync([1, 2, 3]))![0].message).toBe(translateMessage("array_max", [arg]))
    expect(await s1.validateAsync([1, 2])).toBe(undefined)

    const s2 = array().max(() => arg)

    expect(await s2.testAsync([1])).toBe(true)
  })

  test("between", async () => {
    const arg1 = 3
    const arg2 = 5
    const s1 = array().between(arg1, arg2)

    expect(await s1.testAsync([1])).toBe(false)
    expect(await s1.testAsync([1, 2])).toBe(false)
    expect(await s1.testAsync([1, 2, 3])).toBe(true)
    expect(await s1.testAsync([1, 2, 3, 4])).toBe(true)
    expect(await s1.testAsync([1, 2, 3, 4, 5])).toBe(true)
    expect(await s1.testAsync([1, 2, 3, 4, 5, 6])).toBe(false)

    expect((await s1.validateAsync([1]))![0].message).toBe(translateMessage("array_between", [arg1, arg2]))
    expect(await s1.validateAsync([1, 2, 3])).toBe(undefined)

    const s2 = array().between(() => arg1, () => arg2)

    expect(await s2.testAsync([1, 2, 3, 4, 5])).toBe(true)
  })

  test("noneOf", async () => {
    const arg = [2, 3]
    const s1 = array().noneOf(arg)

    expect(await s1.testAsync([1, 2])).toBe(false)
    expect(await s1.testAsync([2, 3])).toBe(false)
    expect(await s1.testAsync([3, 4, 5])).toBe(false)
    expect(await s1.testAsync([1, 4, 5])).toBe(true)

    expect((await s1.validateAsync([2]))![0].message).toBe(translateMessage("array_none_of", [JSON.stringify(arg)]))
    expect(await s1.validateAsync([1])).toBe(undefined)

    const s2 = array().noneOf(() => arg)

    expect(await s2.testAsync([1, 4, 5])).toBe(true)
  })

  test("someOf", async () => {
    const arg = [2, 3]
    const s1 = array().someOf(arg)

    expect(await s1.testAsync([1])).toBe(false)
    expect(await s1.testAsync([1, 2])).toBe(false)
    expect(await s1.testAsync([2, 3, 4])).toBe(false)
    expect(await s1.testAsync([2])).toBe(true)
    expect(await s1.testAsync([3])).toBe(true)
    expect(await s1.testAsync([2, 3])).toBe(true)

    expect((await s1.validateAsync([1]))![0].message).toBe(translateMessage("array_some_of", [JSON.stringify(arg)]))
    expect(await s1.validateAsync([2])).toBe(undefined)

    const s2 = array().someOf(() => arg)

    expect(await s2.testAsync([2, 3])).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const value = [1, 2, 3]
    const s1 = array().toDefault(value)

    expect(await s1.sanitizeAsync(null)).toBe(value)
    expect(await s1.sanitizeAsync(undefined)).toBe(value)
    expect(await s1.sanitizeAsync(1)).toBe(value)
    expect(await s1.sanitizeAsync([])).toEqual([])

    const s2 = array().toDefault(() => value)

    expect(await s2.sanitizeAsync(null)).toBe(value)
  })

  test("toFiltered", async () => {
    const s = array().toFiltered((value) => isString(value))

    expect(await s.sanitizeAsync([1, "2", 3])).toEqual(["2"])
  })

  test("toMapped", async () => {
    const s = array().toMapped((value) => `${ value }_`)

    expect(await s.sanitizeAsync(["1", "2"])).toEqual(["1_", "2_"])
  })

  test("toCompact", async () => {
    const s = array().toCompact()

    expect(await s.sanitizeAsync([1, 0, null, "", undefined])).toEqual([1])
  })

  test("toUnique", async () => {
    const s = array().toUnique()

    expect(await s.sanitizeAsync([1, 2, 1, 2])).toEqual([1, 2])
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("or", () => {
    const s = array().min(2).or(array().min(1).or(boolean()))

    expect(s.test([1])).toBe(true)
    expect(s.test([1, 2])).toBe(true)
    expect(s.test(true)).toBe(true)

    const errors = (s.validate([]))!

    expect(errors.length).toBe(4)
    expect(errors[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors[0].link).toBe(undefined)
    expect(errors[1].message).toBe(translateMessage("array_min", [1]))
    expect(errors[1].link).toBe("or")
    expect(errors[2].message).toBe(translateMessage("boolean_type"))
    expect(errors[2].link).toBe("or.or")
    expect(errors[3].message).toBe(translateMessage("boolean_required"))
    expect(errors[3].link).toBe("or.or")

    expect(s.validate([1])).toBe(undefined)
    expect(s.validate([1, 2])).toBe(undefined)
    expect(s.validate(true)).toBe(undefined)
  })

  test("async or", async () => {
    const s = array().min(2).or(array().min(1).or(boolean()))

    expect(await s.testAsync([1])).toBe(true)
    expect(await s.testAsync([1, 2])).toBe(true)
    expect(await s.testAsync(true)).toBe(true)

    const errors = (await s.validateAsync([]))!

    expect(errors.length).toBe(4)
    expect(errors[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors[0].link).toBe(undefined)
    expect(errors[1].message).toBe(translateMessage("array_min", [1]))
    expect(errors[1].link).toBe("or")
    expect(errors[2].message).toBe(translateMessage("boolean_type"))
    expect(errors[2].link).toBe("or.or")
    expect(errors[3].message).toBe(translateMessage("boolean_required"))
    expect(errors[3].link).toBe("or.or")

    expect(await s.validateAsync([1])).toBe(undefined)
    expect(await s.validateAsync([1, 2])).toBe(undefined)
    expect(await s.validateAsync(true)).toBe(undefined)
  })

  test("and", () => {
    const someOf = ["foo", "bar"]
    const s = array().min(2)
      .and(array().someOf(someOf).and(array().min(3)))

    expect(s.test(["yolo"])).toBe(false)
    expect(s.test(["foo", "bar", "foo"])).toBe(true)

    const errors1 = s.validate(["yolo"])!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("array_min", [2]))

    const errors2 = s.validate(["yolo", "foo"])!

    expect(errors2.length).toBe(1)
    expect(errors2[0].message).toBe(translateMessage("array_some_of", [someOf]))
    expect(errors2[0].link).toBe("and")

    const errors3 = s.validate(["foo", "bar"])!

    expect(errors2.length).toBe(1)
    expect(errors3[0].message).toBe(translateMessage("array_min", [3]))
    expect(errors3[0].link).toBe("and.and")

    expect(s.validate(["foo", "bar", "foo"])).toBe(undefined)
  })

  test("async and", async () => {
    const someOf = ["foo", "bar"]
    const s = array().min(2)
      .and(array().someOf(someOf).and(array().min(3)))

    expect(await s.testAsync(["yolo"])).toBe(false)
    expect(await s.testAsync(["foo", "bar", "foo"])).toBe(true)

    const errors1 = (await s.validateAsync(["yolo"]))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors1[0].link).toBe(undefined)

    const errors2 = (await s.validateAsync(["foo", "bar"]))!

    expect(errors2.length).toBe(1)
    expect(errors2[0].message).toBe(translateMessage("array_min", [3]))
    expect(errors2[0].link).toBe("and.and")

    expect(await s.validateAsync(["foo", "bar", "foo"])).toBe(undefined)
  })

  test("shape", () => {
    const s1 = array(
      string().min(3).or(
        string().min(2),
      ),
    ).min(2)

    expect(s1.test(["1", "123"])).toBe(false)
    expect(s1.test(["12", "123"])).toBe(true)
    expect(s1.test(["12"])).toBe(false)

    const s2 = array().min(2).shape(
      number().or(
        boolean().and(
          boolean().equals(false),
        ),
      ),
    )

    expect(s2.test([1, "1"])).toBe(false)
    expect(s2.test([1, false])).toBe(true)

    const errors1 = s2.validate([1, "1", null])!

    expect(errors1.length).toBe(6)
    expect(errors1[0].message).toBe(translateMessage("number_type"))
    expect(errors1[0].path).toBe("1")
    expect(errors1[0].link).toBe(undefined)
    expect(errors1[1].message).toBe(translateMessage("number_required"))
    expect(errors1[1].path).toBe("1")
    expect(errors1[1].link).toBe(undefined)

    expect(errors1[2].message).toBe(translateMessage("boolean_type"))
    expect(errors1[2].path).toBe("1")
    expect(errors1[2].link).toBe("or")
    expect(errors1[3].message).toBe(translateMessage("boolean_required"))
    expect(errors1[3].path).toBe("1")
    expect(errors1[3].link).toBe("or")

    expect(errors1[4].message).toBe(translateMessage("number_required"))
    expect(errors1[4].path).toBe("2")
    expect(errors1[4].link).toBe(undefined)

    expect(errors1[5].message).toBe(translateMessage("boolean_required"))
    expect(errors1[5].path).toBe("2")
    expect(errors1[5].link).toBe("or")

    const errors2 = s2.validate([1, "1", true])!

    expect(errors2.length).toBe(7)
    expect(errors2[0].message).toBe(translateMessage("number_type"))
    expect(errors2[0].path).toBe("1")
    expect(errors2[0].link).toBe(undefined)
    expect(errors2[1].message).toBe(translateMessage("number_required"))
    expect(errors2[1].path).toBe("1")
    expect(errors2[1].link).toBe(undefined)

    expect(errors2[2].message).toBe(translateMessage("boolean_type"))
    expect(errors2[2].path).toBe("1")
    expect(errors2[2].link).toBe("or")
    expect(errors2[3].message).toBe(translateMessage("boolean_required"))
    expect(errors2[3].path).toBe("1")
    expect(errors2[3].link).toBe("or")

    expect(errors2[4].message).toBe(translateMessage("number_type"))
    expect(errors2[4].path).toBe("2")
    expect(errors2[4].link).toBe(undefined)
    expect(errors2[5].message).toBe(translateMessage("number_required"))
    expect(errors2[5].path).toBe("2")
    expect(errors2[5].link).toBe(undefined)

    expect(errors2[6].message).toBe(translateMessage("boolean_equals", [false]))
    expect(errors2[6].path).toBe("2")
    expect(errors2[6].link).toBe("or.and")

    const errors3 = s2.validate([false])!
    expect(errors3.length).toBe(1)
    expect(errors3[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors3[0].path).toBe(undefined)
    expect(errors3[0].link).toBe(undefined)

    expect(s2.validate([2, false])).toBe(undefined)
    expect(s2.validate([2, 2])).toBe(undefined)
    expect(s2.validate([false, false])).toBe(undefined)
  })

  test("async shape", async () => {
    const s1 = array(
      string().min(3).or(
        string().min(2),
      ),
    ).min(2)

    expect(await s1.testAsync(["1", "123"])).toBe(false)
    expect(await s1.testAsync(["12", "123"])).toBe(true)
    expect(await s1.testAsync(["12"])).toBe(false)

    const s2 = array().min(2).shape(
      number().or(
        boolean().and(
          boolean().equals(false),
        ),
      ),
    )

    expect(await s2.testAsync([1, "1"])).toBe(false)
    expect(await s2.testAsync([1, false])).toBe(true)

    const errors1 = (await s2.validateAsync([1, "1", null]))!

    expect(errors1.length).toBe(6)
    expect(errors1[0].message).toBe(translateMessage("number_type"))
    expect(errors1[0].path).toBe("1")
    expect(errors1[0].link).toBe(undefined)
    expect(errors1[1].message).toBe(translateMessage("number_required"))
    expect(errors1[1].path).toBe("1")
    expect(errors1[1].link).toBe(undefined)

    expect(errors1[2].message).toBe(translateMessage("boolean_type"))
    expect(errors1[2].path).toBe("1")
    expect(errors1[2].link).toBe("or")
    expect(errors1[3].message).toBe(translateMessage("boolean_required"))
    expect(errors1[3].path).toBe("1")
    expect(errors1[3].link).toBe("or")

    expect(errors1[4].message).toBe(translateMessage("number_required"))
    expect(errors1[4].path).toBe("2")
    expect(errors1[4].link).toBe(undefined)
    expect(errors1[5].message).toBe(translateMessage("boolean_required"))
    expect(errors1[5].path).toBe("2")
    expect(errors1[5].link).toBe("or")

    const errors2 = (await s2.validateAsync([1, "1", true]))!

    expect(errors2.length).toBe(7)
    expect(errors2[0].message).toBe(translateMessage("number_type"))
    expect(errors2[0].path).toBe("1")
    expect(errors2[0].link).toBe(undefined)
    expect(errors2[1].message).toBe(translateMessage("number_required"))
    expect(errors2[1].path).toBe("1")
    expect(errors2[1].link).toBe(undefined)

    expect(errors2[2].message).toBe(translateMessage("boolean_type"))
    expect(errors2[2].path).toBe("1")
    expect(errors2[2].link).toBe("or")
    expect(errors2[3].message).toBe(translateMessage("boolean_required"))
    expect(errors2[3].path).toBe("1")
    expect(errors2[3].link).toBe("or")

    expect(errors2[4].message).toBe(translateMessage("number_type"))
    expect(errors2[4].path).toBe("2")
    expect(errors2[4].link).toBe(undefined)
    expect(errors2[5].message).toBe(translateMessage("number_required"))
    expect(errors2[5].path).toBe("2")
    expect(errors2[5].link).toBe(undefined)

    expect(errors2[6].message).toBe(translateMessage("boolean_equals", [false]))
    expect(errors2[6].path).toBe("2")
    expect(errors2[6].link).toBe("or.and")

    const errors3 = (await s2.validateAsync([false]))!
    expect(errors3.length).toBe(1)
    expect(errors3[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors3[0].path).toBe(undefined)
    expect(errors3[0].link).toBe(undefined)

    expect(await s2.validateAsync([2, false])).toBe(undefined)
    expect(await s2.validateAsync([2, 2])).toBe(undefined)
    expect(await s2.validateAsync([false, false])).toBe(undefined)
  })

  test("sanitize", () => {
    const s = array().shape(string().length(2).toTrimmed())

    expect(s.sanitize([" 12 ", "    34   "])).toEqual(["12", "34"])
  })

  test("sanitizeAsync", async () => {
    const s = array().shape(string().length(2).toTrimmed())

    expect(await s.sanitizeAsync([" 12 ", "    34   "])).toEqual(["12", "34"])
  })

  test("sanitizeAndTest", () => {
    const s = array().shape(string().length(2).toTrimmed())

    expect(s.sanitizeAndTest([" 12 ", "    34   "])).toEqual([true, ["12", "34"]])
  })

  test("sanitizeAndTestAsync", async () => {
    const s = array().shape(string().length(2).toTrimmed())

    expect(await s.sanitizeAndTestAsync([" 12 ", "    34   "])).toEqual([true, ["12", "34"]])
  })

  test("validate", () => {
    const s = array().min(2)
    const errors = s.validate([1])!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("array_min", [2]))

    expect(s.validate([1, 2])).toBe(undefined)
  })

  test("validateAsync", async () => {
    const s = array().min(2)
    const errors = (await s.validateAsync([1]))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("array_min", [2]))

    expect(await s.validateAsync([1, 2])).toBe(undefined)
  })

  test("sanitizeAndValidate", () => {
    const s = array().length(2).toCompact()
    const [errors1, value1] = s.sanitizeAndValidate([1, null, undefined])

    expect(errors1!.length).toBe(1)
    expect(errors1![0].message).toBe(translateMessage("array_length", [2]))
    expect(value1).toEqual([1])

    const [errors2, value2] = s.sanitizeAndValidate([1, 2, null, undefined])
    expect(errors2).toBe(undefined)
    expect(value2).toEqual([1, 2])
  })

  test("sanitizeAndValidateAsync", async () => {
    const s = array().length(2).toCompact()
    const [errors1, value1] = await s.sanitizeAndValidateAsync([1, null, undefined])

    expect(errors1!.length).toBe(1)
    expect(errors1![0].message).toBe(translateMessage("array_length", [2]))
    expect(value1).toEqual([1])

    const [errors2, value2] = await s.sanitizeAndValidateAsync([1, 2, null, undefined])
    expect(errors2).toBe(undefined)
    expect(value2).toEqual([1, 2])
  })


  ////////////////////////////////////////////////////////////////////////////////

  test("value().array()", async () => {
    const s = value(['foo']).array()

    expect(s instanceof ArraySchema).toBe(true)
    expect(await s.sanitizeAsync(undefined)).toEqual(['foo'])
  })
})
