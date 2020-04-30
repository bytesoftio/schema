import { number } from "../index"
import { translateMessage } from "../translateMessage"

describe("NumberSchema", () => {
  test("required", async () => {
    const s1 = number()
    const s2 = number().required()

    expect(await s1.test(null)).toBe(false)
    expect(await s2.test(null)).toBe(false)
    expect(await s1.test(undefined)).toBe(false)
    expect(await s2.test(undefined)).toBe(false)
    expect(await s1.test("")).toBe(false)
    expect(await s2.test("")).toBe(false)
    expect(await s1.test(1)).toBe(true)
    expect(await s2.test(1)).toBe(true)

    expect((await s1.validate("1"))![0].message).toBe(translateMessage("number_required"))
    expect(await s1.validate(1)).toBe(undefined)
  })

  test("optional", async () => {
    const s = number().optional()

    expect(await s.test(null)).toBe(true)
    expect(await s.test(undefined)).toBe(true)
    expect(await s.test("")).toBe(false)
    expect(await s.test(1)).toBe(true)

    expect((await s.validate("1"))![0].message).toBe(translateMessage("number_optional"))
    expect(await s.validate(1)).toBe(undefined)
    expect(await s.validate(null)).toBe(undefined)
  })

  test("equals", async () => {
    const equals = 3
    const s1 = number().equals(equals)

    expect(await s1.test(2)).toBe(false)
    expect(await s1.test(4)).toBe(false)
    expect(await s1.test(3.2)).toBe(false)
    expect(await s1.test(equals)).toBe(true)

    expect((await s1.validate(2))![0].message).toBe(translateMessage("number_equals", [equals]))
    expect(await s1.validate(equals)).toBe(undefined)

    const s2 = number().equals(() => equals)

    expect(await s2.test(equals)).toBe(true)
  })

  test("min", async () => {
    const min = 3
    const s1 = number().min(min)

    expect(await s1.test(2)).toBe(false)
    expect(await s1.test(3)).toBe(true)
    expect(await s1.test(4)).toBe(true)

    expect((await s1.validate(2))![0].message).toBe(translateMessage("number_min", [min]))
    expect(await s1.validate(min)).toBe(undefined)

    const s2 = number().min(() => min)

    expect(await s2.test(4)).toBe(true)
  })

  test("max", async () => {
    const max = 3
    const s1 = number().max(max)

    expect(await s1.test(4)).toBe(false)
    expect(await s1.test(3)).toBe(true)
    expect(await s1.test(2)).toBe(true)

    expect((await s1.validate(4))![0].message).toBe(translateMessage("number_max", [max]))
    expect(await s1.validate(max)).toBe(undefined)

    const s2 = number().max(() => max)

    expect(await s2.test(2)).toBe(true)
  })

  test("between", async () => {
    const min = 3
    const max = 5
    const s1 = number().between(min, max)

    expect(await s1.test(2)).toBe(false)
    expect(await s1.test(6)).toBe(false)
    expect(await s1.test(3)).toBe(true)
    expect(await s1.test(4)).toBe(true)
    expect(await s1.test(5)).toBe(true)

    expect((await s1.validate(2))![0].message).toBe(translateMessage("number_between", [min, max]))
    expect(await s1.validate(3)).toBe(undefined)

    const s2 = number().between(() => min, () => max)

    expect(await s2.test(5)).toBe(true)
  })

  test("positive", async () => {
    const s = number().positive()

    expect(await s.test(-1)).toBe(false)
    expect(await s.test(0)).toBe(true)
    expect(await s.test(1)).toBe(true)

    expect((await s.validate(-1))![0].message).toBe(translateMessage("number_positive"))
    expect(await s.validate(1)).toBe(undefined)
  })

  test("negative", async () => {
    const s = number().negative()

    expect(await s.test(1)).toBe(false)
    expect(await s.test(0)).toBe(true)
    expect(await s.test(-1)).toBe(true)

    expect((await s.validate(1))![0].message).toBe(translateMessage("number_negative"))
    expect(await s.validate(-1)).toBe(undefined)
  })

  test("integer", async () => {
    const s = number().integer()

    expect(await s.test(1.2)).toBe(false)
    expect(await s.test(1)).toBe(true)

    expect((await s.validate(1.2))![0].message).toBe(translateMessage("number_integer"))
    expect(await s.validate(1)).toBe(undefined)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const s1 = number().toDefault(1)

    expect(await s1.sanitize(null)).toBe(1)
    expect(await s1.sanitize(undefined)).toBe(1)
    expect(await s1.sanitize(2)).toBe(2)

    const s2 = number().toDefault(() => 1)

    expect(await s2.sanitize(null)).toBe(1)
  })

  test("toRounded", async () => {
    const s = number().toRounded()

    expect(await s.sanitize(1.3)).toBe(1)
    expect(await s.sanitize(1.6)).toBe(2)
  })

  test("toFloored", async () => {
    const s = number().toFloored()

    expect(await s.sanitize(1.3)).toBe(1)
    expect(await s.sanitize(1.6)).toBe(1)
  })

  test("toCeiled", async () => {
    const s = number().toCeiled()

    expect(await s.sanitize(1.3)).toBe(2)
    expect(await s.sanitize(1.6)).toBe(2)
  })

  test("toTrunced", async () => {
    const s = number().toTrunced()

    expect(await s.sanitize(1.3)).toBe(1)
    expect(await s.sanitize(1.6)).toBe(1)
    expect(await s.sanitize(2.3)).toBe(2)
    expect(await s.sanitize(2.6)).toBe(2)
  })
})