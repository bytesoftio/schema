import {
  boolean,
  BooleanSchema,
  value,
} from "../index"
import { translateMessage } from "../translateMessage"

describe("BooleanSchema", () => {
  test("required", async () => {
    const s1 = boolean()
    const s2 = boolean().required()

    expect(await s1.test(null)).toBe(false)
    expect(await s2.test(null)).toBe(false)
    expect(await s1.test(undefined)).toBe(false)
    expect(await s2.test(undefined)).toBe(false)
    expect(await s1.test(1)).toBe(false)
    expect(await s2.test(1)).toBe(false)
    expect(await s1.test(false)).toBe(true)
    expect(await s2.test(false)).toBe(true)

    expect((await s1.validate(null))![0].message).toBe(translateMessage("boolean_required"))
    expect(await s2.validate(true)).toBe(undefined)
  })

  test("optional", async () => {
    const s = boolean().optional()

    expect(await s.test(null)).toBe(true)
    expect(await s.test(undefined)).toBe(true)
    expect(await s.test(1)).toBe(false)
    expect(await s.test(false)).toBe(true)

    expect((await s.validate(1))![0].message).toBe(translateMessage("boolean_optional"))
    expect(await s.validate(true)).toBe(undefined)
    expect(await s.validate(null)).toBe(undefined)
  })

  test("equals", async () => {
    const s1 = boolean().equals(true)

    expect(await s1.test(false)).toBe(false)
    expect(await s1.test(true)).toBe(true)

    expect((await s1.validate(false))![0].message).toBe(translateMessage("boolean_equals", [true]))
    expect(await s1.validate(true)).toBe(undefined)

    const s2 = boolean().equals(() => true)

    expect(await s2.test(true)).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const s1 = boolean().toDefault(true)

    expect(await s1.sanitize(null)).toBe(true)
    expect(await s1.sanitize(undefined)).toBe(true)
    expect(await s1.sanitize(1)).toBe(true)
    expect(await s1.sanitize(false)).toBe(false)

    const s2 = boolean().toDefault(() => true)

    expect(await s2.sanitize(null)).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().boolean()", async () => {
    const s = value(true).boolean()

    expect(s instanceof BooleanSchema).toBe(true)
    expect(await s.sanitize(undefined)).toBe(true)
  })
})
