import {
  MixedSchema,

} from "../index"
import { translateMessage } from "../translateMessage"
import { mixed } from "../factories/mixed"
import { value } from "../factories/value"

describe("MixedSchema", () => {
  test("required", async () => {
    const s1 = mixed()
    const s2 = mixed().required()
    expect(await s1.testAsync(null)).toBe(false)
    expect(await s2.testAsync(null)).toBe(false)
    expect(await s1.testAsync(undefined)).toBe(false)
    expect(await s2.testAsync(undefined)).toBe(false)
    expect(await s1.testAsync(1)).toBe(true)
    expect(await s2.testAsync(1)).toBe(true)
    expect(await s1.testAsync(false)).toBe(true)
    expect(await s2.testAsync(false)).toBe(true)

    const errors1 = (await s1.validateAsync(null))!

    expect(errors1.length).toBe(1)
    expect(errors1[0].message).toBe(translateMessage("mixed_required"))
    expect(await s1.validateAsync("")).toBe(undefined)
  })

  test("optional", async () => {
    const s = mixed().optional()

    expect(await s.testAsync(null)).toBe(true)
    expect(await s.testAsync(undefined)).toBe(true)
    expect(await s.testAsync(1)).toBe(true)
    expect(await s.testAsync(false)).toBe(true)

    expect(await s.validateAsync(null)).toBe(undefined)
  })

  test("equals", async () => {
    const equals = "foo"
    const s1 = mixed().equals(equals)

    expect(await s1.testAsync("bar")).toBe(false)
    expect(await s1.testAsync(1)).toBe(false)
    expect(await s1.testAsync(equals)).toBe(true)

    expect((await s1.validateAsync(""))![0].message).toBe(translateMessage("mixed_equals", [equals]))
    expect(await s1.validateAsync(equals)).toBe(undefined)

    const s2 = mixed().equals(() => equals)

    expect(await s2.testAsync(equals)).toBe(true)
  })

  test("oneOf", async () => {
    const oneOf = [1, "foo"]
    const s1 = mixed().oneOf(oneOf)

    expect(await s1.testAsync(2)).toBe(false)
    expect(await s1.testAsync("bar")).toBe(false)
    expect(await s1.testAsync(1)).toBe(true)
    expect(await s1.testAsync("foo")).toBe(true)

    expect((await s1.validateAsync("1"))![0].message).toBe(translateMessage("mixed_one_of", [oneOf]))
    expect(await s1.validateAsync(1)).toBe(undefined)

    const s2 = mixed().oneOf(() => oneOf)

    expect(await s2.testAsync("foo")).toBe(true)
  })

  test("noneOf", async () => {
    const noneOf = [1, "foo"]
    const s1 = mixed().noneOf(noneOf)

    expect(await s1.testAsync(1)).toBe(false)
    expect(await s1.testAsync("foo")).toBe(false)
    expect(await s1.testAsync(2)).toBe(true)
    expect(await s1.testAsync("bar")).toBe(true)

    expect((await s1.validateAsync(1))![0].message).toBe(translateMessage("mixed_none_of", [noneOf]))
    expect(await s1.validateAsync("1")).toBe(undefined)

    const s2 = mixed().noneOf(() => noneOf)

    expect(await s2.testAsync("bar")).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const s1 = mixed().toDefault(1)

    expect(await s1.sanitizeAsync(null)).toBe(1)
    expect(await s1.sanitizeAsync(undefined)).toBe(1)
    expect(await s1.sanitizeAsync(1)).toBe(1)

    const s2 = mixed().toDefault(() => 1)

    expect(await s2.sanitizeAsync(null)).toBe(1)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().mixed()", async () => {
    const s = value('foo').mixed()

    expect(s instanceof MixedSchema).toBe(true)
    expect(await s.sanitizeAsync(undefined)).toBe('foo')
  })
})
