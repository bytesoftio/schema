import {
  array,
  ArraySchema,
  boolean,
  number,
  string,
  value,
} from "../index"
import { isString } from "lodash"
import { translateMessage } from "../translateMessage"

describe("ArraySchema", () => {
  test("required", async () => {
    const s1 = array()
    const s2 = array().required()

    expect(await s1.test(null)).toBe(false)
    expect(await s2.test(null)).toBe(false)
    expect(await s1.test(undefined)).toBe(false)
    expect(await s2.test(undefined)).toBe(false)
    expect(await s1.test(1)).toBe(false)
    expect(await s2.test(1)).toBe(false)
    expect(await s1.test([])).toBe(true)
    expect(await s2.test([])).toBe(true)

    expect((await s1.validate(null))![0].message).toBe(translateMessage("array_required"))
    expect(await s1.validate([])).toBe(undefined)
  })

  test("optional", async () => {
    const s = array().optional()

    expect(await s.test(null)).toBe(true)
    expect(await s.test(undefined)).toBe(true)
    expect(await s.test(1)).toBe(false)
    expect(await s.test([])).toBe(true)

    expect((await s.validate("a"))![0].message).toBe(translateMessage("array_optional"))
    expect(await s.validate([])).toBe(undefined)
    expect(await s.validate(null)).toBe(undefined)
  })

  test("equals", async () => {
    const arg = [1, 2]
    const s1 = array().equals(arg)

    expect(await s1.test([1, 2, 3])).toBe(false)
    expect(await s1.test([2, 1])).toBe(true)
    expect(await s1.test(arg)).toBe(true)

    expect((await s1.validate([]))![0].message).toBe(translateMessage("array_equals", [arg]))
    expect(await s1.validate(arg)).toBe(undefined)

    const s2 = array().equals(() => arg)

    expect(await s2.test(arg)).toBe(true)
  })

  test("length", async () => {
    const arg = 3
    const s1 = array().length(arg)

    expect(await s1.test([1, 2])).toBe(false)
    expect(await s1.test([1, 2, 3, 4])).toBe(false)
    expect(await s1.test([1, 2, 3])).toBe(true)

    expect((await s1.validate([]))![0].message).toBe(translateMessage("array_length", [arg]))
    expect(await s1.validate([1, 2, 3])).toBe(undefined)

    const s2 = array().length(() => arg)

    expect(await s2.test([1, 2, 3])).toBe(true)
  })

  test("min", async () => {
    const arg = 2
    const s1 = array().min(arg)

    expect(await s1.test([1])).toBe(false)
    expect(await s1.test([1, 2])).toBe(true)

    expect((await s1.validate([]))![0].message).toBe(translateMessage("array_min", [arg]))
    expect(await s1.validate([1, 2])).toBe(undefined)

    const s2 = array().min(() => arg)

    expect(await s2.test([1, 2])).toBe(true)
  })

  test("max", async () => {
    const arg = 2
    const s1 = array().max(arg)

    expect(await s1.test([1, 2, 3])).toBe(false)
    expect(await s1.test([1, 2])).toBe(true)
    expect(await s1.test([1])).toBe(true)

    expect((await s1.validate([1, 2, 3]))![0].message).toBe(translateMessage("array_max", [arg]))
    expect(await s1.validate([1, 2])).toBe(undefined)

    const s2 = array().max(() => arg)

    expect(await s2.test([1])).toBe(true)
  })

  test("between", async () => {
    const arg1 = 3
    const arg2 = 5
    const s1 = array().between(arg1, arg2)

    expect(await s1.test([1])).toBe(false)
    expect(await s1.test([1, 2])).toBe(false)
    expect(await s1.test([1, 2, 3])).toBe(true)
    expect(await s1.test([1, 2, 3, 4])).toBe(true)
    expect(await s1.test([1, 2, 3, 4, 5])).toBe(true)
    expect(await s1.test([1, 2, 3, 4, 5, 6])).toBe(false)

    expect((await s1.validate([1]))![0].message).toBe(translateMessage("array_between", [arg1, arg2]))
    expect(await s1.validate([1, 2, 3])).toBe(undefined)

    const s2 = array().between(() => arg1, () => arg2)

    expect(await s2.test([1, 2, 3, 4, 5])).toBe(true)
  })

  test("noneOf", async () => {
    const arg = [2, 3]
    const s1 = array().noneOf(arg)

    expect(await s1.test([1, 2])).toBe(false)
    expect(await s1.test([2, 3])).toBe(false)
    expect(await s1.test([3, 4, 5])).toBe(false)
    expect(await s1.test([1, 4, 5])).toBe(true)

    expect((await s1.validate([2]))![0].message).toBe(translateMessage("array_none_of", [JSON.stringify(arg)]))
    expect(await s1.validate([1])).toBe(undefined)

    const s2 = array().noneOf(() => arg)

    expect(await s2.test([1, 4, 5])).toBe(true)
  })

  test("someOf", async () => {
    const arg = [2, 3]
    const s1 = array().someOf(arg)

    expect(await s1.test([1])).toBe(false)
    expect(await s1.test([1, 2])).toBe(false)
    expect(await s1.test([2, 3, 4])).toBe(false)
    expect(await s1.test([2])).toBe(true)
    expect(await s1.test([3])).toBe(true)
    expect(await s1.test([2, 3])).toBe(true)

    expect((await s1.validate([1]))![0].message).toBe(translateMessage("array_some_of", [JSON.stringify(arg)]))
    expect(await s1.validate([2])).toBe(undefined)

    const s2 = array().someOf(() => arg)

    expect(await s2.test([2, 3])).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const value = [1, 2, 3]
    const s1 = array().toDefault(value)

    expect(await s1.sanitize(null)).toBe(value)
    expect(await s1.sanitize(undefined)).toBe(value)
    expect(await s1.sanitize(1)).toBe(value)
    expect(await s1.sanitize([])).toEqual([])

    const s2 = array().toDefault(() => value)

    expect(await s2.sanitize(null)).toBe(value)
  })

  test("toFiltered", async () => {
    const s = array().toFiltered((value) => isString(value))

    expect(await s.sanitize([1, "2", 3])).toEqual(["2"])
  })

  test("toMapped", async () => {
    const s = array().toMapped((value) => `${ value }_`)

    expect(await s.sanitize(["1", "2"])).toEqual(["1_", "2_"])
  })

  test("toCompact", async () => {
    const s = array().toCompact()

    expect(await s.sanitize([1, 0, null, "", undefined])).toEqual([1])
  })

  test("toUnique", async () => {
    const s = array().toUnique()

    expect(await s.sanitize([1, 2, 1, 2])).toEqual([1, 2])
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("or", async () => {
    const s = array().min(2).or(array().min(1).or(boolean()))

    expect(await s.test([1])).toBe(true)
    expect(await s.test([1, 2])).toBe(true)
    expect(await s.test(true)).toBe(true)

    const errors = (await s.validate([]))!

    expect(errors.length).toBe(3)
    expect(errors[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors[0].link).toBe(undefined)
    expect(errors[1].message).toBe(translateMessage("array_min", [1]))
    expect(errors[1].link).toBe("or")
    expect(errors[2].message).toBe(translateMessage("boolean_required"))
    expect(errors[2].link).toBe("or.or")

    expect(await s.validate([1])).toBe(undefined)
    expect(await s.validate([1, 2])).toBe(undefined)
    expect(await s.validate(true)).toBe(undefined)
  })

  test("and", async () => {
    const someOf = ["foo", "bar"]
    const s = array().min(2)
      .and(array().someOf(someOf).and(array().min(3)))

    expect(await s.test(["yolo"])).toBe(false)
    expect(await s.test(["foo", "bar", "foo"])).toBe(true)

    const errors = (await s.validate(["yolo"]))!

    expect(errors.length).toBe(3)
    expect(errors[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors[0].link).toBe(undefined)
    expect(errors[1].message).toBe(translateMessage("array_some_of", [someOf]))
    expect(errors[1].link).toBe("and")
    expect(errors[2].message).toBe(translateMessage("array_min", [3]))
    expect(errors[2].link).toBe("and.and")

    expect(await s.validate(["foo", "bar", "foo"])).toBe(undefined)
  })

  test("shape", async () => {
    const s1 = array(
      string().min(3).or(
        string().min(2),
      ),
    ).min(2)

    expect(await s1.test(["1", "123"])).toBe(false)
    expect(await s1.test(["12", "123"])).toBe(true)
    expect(await s1.test(["12"])).toBe(false)

    const s2 = array().min(2).shape(
      number().or(
        boolean().and(
          boolean().equals(false),
        ),
      ),
    )

    expect(await s2.test([1, "1"])).toBe(false)
    expect(await s2.test([1, false])).toBe(true)

    const errors1 = (await s2.validate([1, "1", null]))!

    expect(errors1.length).toBe(4)
    expect(errors1[0].message).toBe(translateMessage("number_required"))
    expect(errors1[0].path).toBe("1")
    expect(errors1[0].link).toBe(undefined)
    expect(errors1[1].message).toBe(translateMessage("boolean_required"))
    expect(errors1[1].path).toBe("1")
    expect(errors1[1].link).toBe("or")
    expect(errors1[2].message).toBe(translateMessage("number_required"))
    expect(errors1[2].path).toBe("2")
    expect(errors1[2].link).toBe(undefined)
    expect(errors1[3].message).toBe(translateMessage("boolean_required"))
    expect(errors1[3].path).toBe("2")
    expect(errors1[3].link).toBe("or")

    const errors2 = (await s2.validate([1, "1", true]))!

    expect(errors2.length).toBe(4)
    expect(errors2[0].message).toBe(translateMessage("number_required"))
    expect(errors2[0].path).toBe("1")
    expect(errors2[0].link).toBe(undefined)
    expect(errors2[1].message).toBe(translateMessage("boolean_required"))
    expect(errors2[1].path).toBe("1")
    expect(errors2[1].link).toBe("or")
    expect(errors2[2].message).toBe(translateMessage("number_required"))
    expect(errors2[2].path).toBe("2")
    expect(errors2[2].link).toBe(undefined)
    expect(errors2[3].message).toBe(translateMessage("boolean_equals", [false]))
    expect(errors2[3].path).toBe("2")
    expect(errors2[3].link).toBe("or.and")

    const errors3 = (await s2.validate([false]))!
    expect(errors3.length).toBe(1)
    expect(errors3[0].message).toBe(translateMessage("array_min", [2]))
    expect(errors3[0].path).toBe(undefined)
    expect(errors3[0].link).toBe(undefined)

    expect(await s2.validate([2, false])).toBe(undefined)
    expect(await s2.validate([2, 2])).toBe(undefined)
    expect(await s2.validate([false, false])).toBe(undefined)
  })

  test("sanitize", async () => {
    const s = array().shape(string().length(2).toTrimmed())

    expect(await s.sanitize([" 12 ", "    34   "])).toEqual(["12", "34"])
  })

  test("sanitizeAndTest", async () => {
    const s = array().shape(string().length(2).toTrimmed())

    expect(await s.sanitizeAndTest([" 12 ", "    34   "])).toEqual([true, ["12", "34"]])
  })

  test("validate", async () => {
    const s = array().min(2)
    const errors = (await s.validate([1]))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("array_min", [2]))

    expect(await s.validate([1, 2])).toBe(undefined)
  })

  test("sanitizeAndValidate", async () => {
    const s = array().length(2).toCompact()
    const [errors1, value1] = await s.sanitizeAndValidate([1, null, undefined])

    expect(errors1!.length).toBe(1)
    expect(errors1![0].message).toBe(translateMessage("array_length", [2]))
    expect(value1).toEqual([1])

    const [errors2, value2] = await s.sanitizeAndValidate([1, 2, null, undefined])
    expect(errors2).toBe(undefined)
    expect(value2).toEqual([1, 2])
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().array()", async () => {
    const s = value(['foo']).array()

    expect(s instanceof ArraySchema).toBe(true)
    expect(await s.sanitize(undefined)).toEqual(['foo'])
  })
})
