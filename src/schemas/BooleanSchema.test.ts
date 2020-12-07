import {
  BooleanSchema,

} from "../index"
import { translateMessage } from "../translateMessage"
import { boolean } from "../factories/boolean"
import { value } from "../factories/value"

describe("BooleanSchema", () => {
  test("required", async () => {
    const s1 = boolean()
    const s2 = boolean().required()

    expect(await s1.testAsync(null)).toBe(false)
    expect(await s2.testAsync(null)).toBe(false)
    expect(await s1.testAsync(undefined)).toBe(false)
    expect(await s2.testAsync(undefined)).toBe(false)
    expect(await s1.testAsync(1)).toBe(false)
    expect(await s2.testAsync(1)).toBe(false)
    expect(await s1.testAsync(false)).toBe(true)
    expect(await s2.testAsync(false)).toBe(true)

    const errors1 = (await s1.validateAsync(null))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("boolean_required"))

    const errors2 = (await s1.validateAsync(1))!

    expect(errors2.length).toBe(2)
    expect(errors2[0].message).toBe(translateMessage("boolean_type"))
    expect(errors2[1].message).toBe(translateMessage("boolean_required"))

    expect(await s2.validateAsync(true)).toBe(undefined)

    expect(boolean().required(false).test(undefined)).toBe(true)
    expect(boolean().required(() => false).test(undefined)).toBe(true)
    expect(boolean().required(() => true).test(undefined)).toBe(false)
  })

  test("optional", async () => {
    const s = boolean().optional()

    expect(await s.testAsync(null)).toBe(true)
    expect(await s.testAsync(undefined)).toBe(true)
    expect(await s.testAsync(1)).toBe(false)
    expect(await s.testAsync(false)).toBe(true)

    const errors1 = (await s.validateAsync(1))!
    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("boolean_type"))

    expect(await s.validateAsync(true)).toBe(undefined)
    expect(await s.validateAsync(null)).toBe(undefined)
  })

  test("equals", async () => {
    const s1 = boolean().equals(true)

    expect(await s1.testAsync(false)).toBe(false)
    expect(await s1.testAsync(true)).toBe(true)

    expect((await s1.validateAsync(false))![0].message).toBe(translateMessage("boolean_equals", [true]))
    expect(await s1.validateAsync(true)).toBe(undefined)

    const s2 = boolean().equals(() => true)

    expect(await s2.testAsync(true)).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const s1 = boolean().toDefault(true)

    expect(await s1.sanitizeAsync(null)).toBe(true)
    expect(await s1.sanitizeAsync(undefined)).toBe(true)
    expect(await s1.sanitizeAsync(1)).toBe(true)
    expect(await s1.sanitizeAsync(false)).toBe(false)

    const s2 = boolean().toDefault(() => true)

    expect(await s2.sanitizeAsync(null)).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().boolean()", async () => {
    const s = value(true).boolean()

    expect(s instanceof BooleanSchema).toBe(true)
    expect(await s.sanitizeAsync(undefined)).toBe(true)
  })
})
