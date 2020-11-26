import {
  date,
  DateSchema,
  value,
} from "../index"
import {
  addDays,
  subDays,
} from "date-fns"
import { translateMessage } from "../translateMessage"

describe("DateSchema", () => {
  test("required", async () => {
    const s1 = date()
    const s2 = date().required()
    expect(await s2.testAsync(null)).toBe(false)
    expect(await s1.testAsync(null)).toBe(false)
    expect(await s2.testAsync(undefined)).toBe(false)
    expect(await s1.testAsync(undefined)).toBe(false)
    expect(await s2.testAsync(1)).toBe(false)
    expect(await s1.testAsync(1)).toBe(false)
    expect(await s2.testAsync(new Date())).toBe(true)
    expect(await s1.testAsync(new Date())).toBe(true)

    expect((await s1.validateAsync(null))![0].message).toBe(translateMessage("date_required"))
    expect(await s2.validateAsync(new Date())).toBe(undefined)
  })

  test("optional", async () => {
    const s = date().optional()

    expect(await s.testAsync(null)).toBe(true)
    expect(await s.testAsync(undefined)).toBe(true)
    expect(await s.testAsync(1)).toBe(false)
    expect(await s.testAsync(new Date())).toBe(true)

    expect((await s.validateAsync("-"))![0].message).toBe(translateMessage("date_optional"))
    expect(await s.validateAsync(new Date())).toBe(undefined)
    expect(await s.validateAsync(null)).toBe(undefined)
  })

  test("equals", async () => {
    const equals = new Date(2019, 8, 4)
    const s1 = date().equals(equals)

    expect(await s1.testAsync(new Date(2019, 8, 5))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 3))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 7, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 4))).toBe(true)

    expect((await s1.validateAsync(new Date(2019, 8, 5)))![0].message).toBe(translateMessage("date_equals", [equals]))
    expect(await s1.validateAsync(equals)).toBe(undefined)

    const s2 = date().equals(() => equals)

    expect(await s2.testAsync(new Date(2019, 8, 4))).toBe(true)
  })

  test("after", async () => {
    const after = new Date(2019, 8, 4)
    const s1 = date().after(after)

    expect(await s1.testAsync(new Date(2019, 7, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 3))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 5))).toBe(true)
    expect(await s1.testAsync(new Date(2019, 9, 4))).toBe(true)

    expect((await s1.validateAsync(new Date(2019, 7, 4)))![0].message).toBe(translateMessage("date_after", [after]))
    expect(await s1.validateAsync(addDays(after, 1))).toBe(undefined)

    const s2 = date().after(() => after)
    expect(await s2.testAsync(new Date(2019, 9, 4))).toBe(true)
  })

  test("before", async () => {
    const before = new Date(2019, 8, 4)
    const s1 = date().before(before)

    expect(await s1.testAsync(new Date(2019, 8, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 5))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 9, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 3))).toBe(true)
    expect(await s1.testAsync(new Date(2019, 7, 4))).toBe(true)

    expect((await s1.validateAsync(new Date(2019, 8, 4)))![0].message).toBe(translateMessage("date_before", [before]))
    expect(await s1.validateAsync(subDays(before, 1))).toBe(undefined)

    const s2 = date().before(() => before)
    expect(await s2.testAsync(new Date(2019, 7, 4))).toBe(true)
  })

  test("between", async () => {
    const after = new Date(2019, 8, 4)
    const before = new Date(2019, 9, 4)
    const s1 = date().between(after, before)

    expect(await s1.testAsync(new Date(2019, 7, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 9, 4))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 9, 5))).toBe(false)
    expect(await s1.testAsync(new Date(2019, 8, 5))).toBe(true)
    expect(await s1.testAsync(new Date(2019, 9, 3))).toBe(true)

    expect((await s1.validateAsync(new Date(2019, 7, 4)))![0].message).toBe(translateMessage("date_between", [after, before]))
    expect(await s1.validateAsync(addDays(after, 1))).toBe(undefined)

    const s2 = date().between(() => after, () => before)

    expect(await s2.testAsync(new Date(2019, 9, 3))).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const newDate = new Date()
    const s1 = date().toDefault(newDate)
    const otherDate = new Date()

    expect(await s1.sanitizeAsync(null)).toBe(newDate)
    expect(await s1.sanitizeAsync(undefined)).toBe(newDate)
    expect(await s1.sanitizeAsync(1)).toBe(newDate)
    expect(await s1.sanitizeAsync(otherDate)).toBe(otherDate)

    const s2 = date().toDefault(() => newDate)

    expect(await s2.sanitizeAsync(null)).toBe(newDate)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().date()", async () => {
    const date = new Date()
    const s = value(date).date()

    expect(s instanceof DateSchema).toBe(true)
    expect(await s.sanitizeAsync(undefined)).toBe(date)
  })
})
