import {
  NumberSchema,

} from "../index"
import { translateMessage } from "../translateMessage"
import { number } from "../factories/number"
import { value } from "../factories/value"

describe("NumberSchema", () => {
  test("required", async () => {
    const s1 = number()
    const s2 = number().required()

    expect(await s1.testAsync(null)).toBe(false)
    expect(await s2.testAsync(null)).toBe(false)
    expect(await s1.testAsync(undefined)).toBe(false)
    expect(await s2.testAsync(undefined)).toBe(false)
    expect(await s1.testAsync("")).toBe(false)
    expect(await s2.testAsync("")).toBe(false)
    expect(await s1.testAsync(1)).toBe(true)
    expect(await s2.testAsync(1)).toBe(true)

    const errors1 = (await s1.validateAsync(null))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("number_required"))

    const errors2 = (await s1.validateAsync("1"))!

    expect(errors2.length).toBe(2)
    expect(errors2[0].message).toBe(translateMessage("number_type"))
    expect(errors2[1].message).toBe(translateMessage("number_required"))

    expect(await s1.validateAsync(1)).toBe(undefined)
  })

  test("optional", async () => {
    const s = number().optional()

    expect(await s.testAsync(null)).toBe(true)
    expect(await s.testAsync(undefined)).toBe(true)
    expect(await s.testAsync("")).toBe(false)
    expect(await s.testAsync(1)).toBe(true)

    const errors1 = (await s.validateAsync("1"))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("number_type"))
    expect(await s.validateAsync(1)).toBe(undefined)
    expect(await s.validateAsync(null)).toBe(undefined)
  })

  test("equals", async () => {
    const equals = 3
    const s1 = number().equals(equals)

    expect(await s1.testAsync(2)).toBe(false)
    expect(await s1.testAsync(4)).toBe(false)
    expect(await s1.testAsync(3.2)).toBe(false)
    expect(await s1.testAsync(equals)).toBe(true)

    expect((await s1.validateAsync(2))![0].message).toBe(translateMessage("number_equals", [equals]))
    expect(await s1.validateAsync(equals)).toBe(undefined)

    const s2 = number().equals(() => equals)

    expect(await s2.testAsync(equals)).toBe(true)
  })

  test("min", async () => {
    const min = 3
    const s1 = number().min(min)

    expect(await s1.testAsync(2)).toBe(false)
    expect(await s1.testAsync(3)).toBe(true)
    expect(await s1.testAsync(4)).toBe(true)

    expect((await s1.validateAsync(2))![0].message).toBe(translateMessage("number_min", [min]))
    expect(await s1.validateAsync(min)).toBe(undefined)

    const s2 = number().min(() => min)

    expect(await s2.testAsync(4)).toBe(true)
  })

  test("max", async () => {
    const max = 3
    const s1 = number().max(max)

    expect(await s1.testAsync(4)).toBe(false)
    expect(await s1.testAsync(3)).toBe(true)
    expect(await s1.testAsync(2)).toBe(true)

    expect((await s1.validateAsync(4))![0].message).toBe(translateMessage("number_max", [max]))
    expect(await s1.validateAsync(max)).toBe(undefined)

    const s2 = number().max(() => max)

    expect(await s2.testAsync(2)).toBe(true)
  })

  test("between", async () => {
    const min = 3
    const max = 5
    const s1 = number().between(min, max)

    expect(await s1.testAsync(2)).toBe(false)
    expect(await s1.testAsync(6)).toBe(false)
    expect(await s1.testAsync(3)).toBe(true)
    expect(await s1.testAsync(4)).toBe(true)
    expect(await s1.testAsync(5)).toBe(true)

    expect((await s1.validateAsync(2))![0].message).toBe(translateMessage("number_between", [min, max]))
    expect(await s1.validateAsync(3)).toBe(undefined)

    const s2 = number().between(() => min, () => max)

    expect(await s2.testAsync(5)).toBe(true)
  })

  test("positive", async () => {
    const s = number().positive()

    expect(await s.testAsync(-1)).toBe(false)
    expect(await s.testAsync(0)).toBe(true)
    expect(await s.testAsync(1)).toBe(true)

    expect((await s.validateAsync(-1))![0].message).toBe(translateMessage("number_positive"))
    expect(await s.validateAsync(1)).toBe(undefined)
  })

  test("negative", async () => {
    const s = number().negative()

    expect(await s.testAsync(1)).toBe(false)
    expect(await s.testAsync(0)).toBe(true)
    expect(await s.testAsync(-1)).toBe(true)

    expect((await s.validateAsync(1))![0].message).toBe(translateMessage("number_negative"))
    expect(await s.validateAsync(-1)).toBe(undefined)
  })

  test("integer", async () => {
    const s = number().integer()

    expect(await s.testAsync(1.2)).toBe(false)
    expect(await s.testAsync(1)).toBe(true)

    expect((await s.validateAsync(1.2))![0].message).toBe(translateMessage("number_integer"))
    expect(await s.validateAsync(1)).toBe(undefined)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const s1 = number().toDefault(1)

    expect(await s1.sanitizeAsync(null)).toBe(1)
    expect(await s1.sanitizeAsync(undefined)).toBe(1)
    expect(await s1.sanitizeAsync(2)).toBe(2)

    const s2 = number().toDefault(() => 1)

    expect(await s2.sanitizeAsync(null)).toBe(1)
  })

  test("toRounded", async () => {
    const s = number().toRounded()

    expect(await s.sanitizeAsync(1.3)).toBe(1)
    expect(await s.sanitizeAsync(1.6)).toBe(2)
  })

  test("toFloored", async () => {
    const s = number().toFloored()

    expect(await s.sanitizeAsync(1.3)).toBe(1)
    expect(await s.sanitizeAsync(1.6)).toBe(1)
  })

  test("toCeiled", async () => {
    const s = number().toCeiled()

    expect(await s.sanitizeAsync(1.3)).toBe(2)
    expect(await s.sanitizeAsync(1.6)).toBe(2)
  })

  test("toTrunced", async () => {
    const s = number().toTrunced()

    expect(await s.sanitizeAsync(1.3)).toBe(1)
    expect(await s.sanitizeAsync(1.6)).toBe(1)
    expect(await s.sanitizeAsync(2.3)).toBe(2)
    expect(await s.sanitizeAsync(2.6)).toBe(2)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().number()", async () => {
    const s = value(1).number()

    expect(s instanceof NumberSchema).toBe(true)
    expect(await s.sanitizeAsync(undefined)).toBe(1)
  })
})
