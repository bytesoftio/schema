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
    expect(await s2.test(null)).toBe(false)
    expect(await s1.test(null)).toBe(false)
    expect(await s2.test(undefined)).toBe(false)
    expect(await s1.test(undefined)).toBe(false)
    expect(await s2.test(1)).toBe(false)
    expect(await s1.test(1)).toBe(false)
    expect(await s2.test(new Date())).toBe(true)
    expect(await s1.test(new Date())).toBe(true)

    expect((await s1.validate(null))![0].message).toBe(translateMessage("date_required"))
    expect(await s2.validate(new Date())).toBe(undefined)
  })

  test("optional", async () => {
    const s = date().optional()

    expect(await s.test(null)).toBe(true)
    expect(await s.test(undefined)).toBe(true)
    expect(await s.test(1)).toBe(false)
    expect(await s.test(new Date())).toBe(true)

    expect((await s.validate("-"))![0].message).toBe(translateMessage("date_optional"))
    expect(await s.validate(new Date())).toBe(undefined)
    expect(await s.validate(null)).toBe(undefined)
  })

  test("equals", async () => {
    const equals = new Date(2019, 8, 4)
    const s1 = date().equals(equals)

    expect(await s1.test(new Date(2019, 8, 5))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 3))).toBe(false)
    expect(await s1.test(new Date(2019, 7, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 4))).toBe(true)

    expect((await s1.validate(new Date(2019, 8, 5)))![0].message).toBe(translateMessage("date_equals", [equals]))
    expect(await s1.validate(equals)).toBe(undefined)

    const s2 = date().equals(() => equals)

    expect(await s2.test(new Date(2019, 8, 4))).toBe(true)
  })

  test("after", async () => {
    const after = new Date(2019, 8, 4)
    const s1 = date().after(after)

    expect(await s1.test(new Date(2019, 7, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 3))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 5))).toBe(true)
    expect(await s1.test(new Date(2019, 9, 4))).toBe(true)

    expect((await s1.validate(new Date(2019, 7, 4)))![0].message).toBe(translateMessage("date_after", [after]))
    expect(await s1.validate(addDays(after, 1))).toBe(undefined)

    const s2 = date().after(() => after)
    expect(await s2.test(new Date(2019, 9, 4))).toBe(true)
  })

  test("before", async () => {
    const before = new Date(2019, 8, 4)
    const s1 = date().before(before)

    expect(await s1.test(new Date(2019, 8, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 5))).toBe(false)
    expect(await s1.test(new Date(2019, 9, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 3))).toBe(true)
    expect(await s1.test(new Date(2019, 7, 4))).toBe(true)

    expect((await s1.validate(new Date(2019, 8, 4)))![0].message).toBe(translateMessage("date_before", [before]))
    expect(await s1.validate(subDays(before, 1))).toBe(undefined)

    const s2 = date().before(() => before)
    expect(await s2.test(new Date(2019, 7, 4))).toBe(true)
  })

  test("between", async () => {
    const after = new Date(2019, 8, 4)
    const before = new Date(2019, 9, 4)
    const s1 = date().between(after, before)

    expect(await s1.test(new Date(2019, 7, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 9, 4))).toBe(false)
    expect(await s1.test(new Date(2019, 9, 5))).toBe(false)
    expect(await s1.test(new Date(2019, 8, 5))).toBe(true)
    expect(await s1.test(new Date(2019, 9, 3))).toBe(true)

    expect((await s1.validate(new Date(2019, 7, 4)))![0].message).toBe(translateMessage("date_between", [after, before]))
    expect(await s1.validate(addDays(after, 1))).toBe(undefined)

    const s2 = date().between(() => after, () => before)

    expect(await s2.test(new Date(2019, 9, 3))).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const newDate = new Date()
    const s1 = date().toDefault(newDate)
    const otherDate = new Date()

    expect(await s1.sanitize(null)).toBe(newDate)
    expect(await s1.sanitize(undefined)).toBe(newDate)
    expect(await s1.sanitize(1)).toBe(newDate)
    expect(await s1.sanitize(otherDate)).toBe(otherDate)

    const s2 = date().toDefault(() => newDate)

    expect(await s2.sanitize(null)).toBe(newDate)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("value().date()", async () => {
    const date = new Date()
    const s = value(date).date()

    expect(s instanceof DateSchema).toBe(true)
    expect(await s.sanitize(undefined)).toBe(date)
  })
})
