import {
  mixed,
  MixedSchema,
  value,
} from "../index"
import { translateMessage } from "../translateMessage"

describe("MixedSchema", () => {
  test("required", async () => {
    const s1 = mixed()
    const s2 = mixed().required()
    expect(await s1.test(null)).toBe(false)
    expect(await s2.test(null)).toBe(false)
    expect(await s1.test(undefined)).toBe(false)
    expect(await s2.test(undefined)).toBe(false)
    expect(await s1.test(1)).toBe(true)
    expect(await s2.test(1)).toBe(true)
    expect(await s1.test(false)).toBe(true)
    expect(await s2.test(false)).toBe(true)

    expect((await s1.validate(null))![0].message).toBe(translateMessage("mixed_required"))
    expect(await s1.validate("")).toBe(undefined)
  })

  test("optional", async () => {
    const s = mixed().optional()

    expect(await s.test(null)).toBe(true)
    expect(await s.test(undefined)).toBe(true)
    expect(await s.test(1)).toBe(true)
    expect(await s.test(false)).toBe(true)

    expect(await s.validate(null)).toBe(undefined)
  })

  test("equals", async () => {
    const equals = "foo"
    const s1 = mixed().equals(equals)

    expect(await s1.test("bar")).toBe(false)
    expect(await s1.test(1)).toBe(false)
    expect(await s1.test(equals)).toBe(true)

    expect((await s1.validate(""))![0].message).toBe(translateMessage("mixed_equals", [equals]))
    expect(await s1.validate(equals)).toBe(undefined)

    const s2 = mixed().equals(() => equals)

    expect(await s2.test(equals)).toBe(true)
  })

  test("oneOf", async () => {
    const oneOf = [1, "foo"]
    const s1 = mixed().oneOf(oneOf)

    expect(await s1.test(2)).toBe(false)
    expect(await s1.test("bar")).toBe(false)
    expect(await s1.test(1)).toBe(true)
    expect(await s1.test("foo")).toBe(true)

    expect((await s1.validate("1"))![0].message).toBe(translateMessage("mixed_one_of", [oneOf]))
    expect(await s1.validate(1)).toBe(undefined)

    const s2 = mixed().oneOf(() => oneOf)

    expect(await s2.test("foo")).toBe(true)
  })

  test("noneOf", async () => {
    const noneOf = [1, "foo"]
    const s1 = mixed().noneOf(noneOf)

    expect(await s1.test(1)).toBe(false)
    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test(2)).toBe(true)
    expect(await s1.test("bar")).toBe(true)

    expect((await s1.validate(1))![0].message).toBe(translateMessage("mixed_none_of", [noneOf]))
    expect(await s1.validate("1")).toBe(undefined)

    const s2 = mixed().noneOf(() => noneOf)

    expect(await s2.test("bar")).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const s1 = mixed().toDefault(1)

    expect(await s1.sanitize(null)).toBe(1)
    expect(await s1.sanitize(undefined)).toBe(1)
    expect(await s1.sanitize(1)).toBe(1)

    const s2 = mixed().toDefault(() => 1)

    expect(await s2.sanitize(null)).toBe(1)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().mixed()", async () => {
    const s = value('foo').mixed()

    expect(s instanceof MixedSchema).toBe(true)
    expect(await s.sanitize(undefined)).toBe('foo')
  })
})
