import { addDays, subDays } from "date-fns"
import { string } from "../index"
import { translateMessage } from "../translateMessage"

describe("StringSchema", () => {
  test("required", async () => {
    const s1 = string()
    const s2 = string().required()

    expect(await s1.test(null)).toBe(false)
    expect(await s2.test(null)).toBe(false)
    expect(await s1.test(undefined)).toBe(false)
    expect(await s2.test(undefined)).toBe(false)
    expect(await s1.test(1)).toBe(false)
    expect(await s2.test(1)).toBe(false)
    expect(await s1.test("")).toBe(false)
    expect(await s2.test("")).toBe(false)
    expect(await s1.test("1")).toBe(true)
    expect(await s2.test("1")).toBe(true)

    const errors1 = (await s1.validate(null))!
    expect(errors1[0].message).toBe(translateMessage("string_required"))
    expect(errors1[0].value).toBe(null)

    expect(await s1.validate("1")).toBe(undefined)
  })

  test("optional", async () => {
    const s = string().optional()

    expect(await s.test(null)).toBe(true)
    expect(await s.test(undefined)).toBe(true)
    expect(await s.test(1)).toBe(false)
    expect(await s.test("")).toBe(true)

    expect((await s.validate(1))![0].message).toBe(translateMessage("string_optional"))
    expect(await s.validate(null)).toBe(undefined)
  })

  test("is immutable", async () => {
    const s1 = string()
    const s2 = string().optional()

    expect(s1 === s1).toBe(true)
    expect(s1 === s2).toBe(false)
  })

  test("optional and required", async () => {
    expect(await string().required().test(null)).toBe(false)
    expect(await string().required().optional().test(null)).toBe(true)
    expect(await string().required().optional().required().test(null)).toBe(false)
  })

  test("equals", async () => {
    const arg = "joker"
    const s1 = string().equals(arg)

    expect(await s1.test("")).toBe(false)
    expect(await s1.test(arg)).toBe(true)

    expect((await s1.validate("2"))![0].message).toBe(translateMessage("string_equals", [arg]))
    expect(await s1.validate(arg)).toBe(undefined)

    const s2 = string().equals(() => arg)

    expect(await s2.test(arg)).toBe(true)
  })

  test("length", async () => {
    const arg = 5
    const s1 = string().length(arg)

    expect(await s1.test("")).toBe(false)
    expect(await s1.test("123")).toBe(false)
    expect(await s1.test("12345")).toBe(true)

    expect((await s1.validate("1"))![0].message).toBe(translateMessage("string_length", [arg]))
    expect(await s1.validate("12345")).toBe(undefined)

    const s2 = string().length(() => arg)

    expect(await s2.test("12345")).toBe(true)
  })

  test("overrides previous definitions with same type", async () => {
    const s = string().min(4).min(3)

    expect(await s.test("123")).toBe(true)
    expect(await s.test("1234")).toBe(true)
  })

  test("min", async () => {
    const arg = 5
    const s1 = string().min(arg)

    expect(await s1.test("")).toBe(false)
    expect(await s1.test("123")).toBe(false)
    expect(await s1.test("12345")).toBe(true)
    expect(await s1.test("123456")).toBe(true)

    expect((await s1.validate("1"))![0].message).toBe(translateMessage("string_min", [arg]))
    expect(await s1.validate("12345")).toBe(undefined)

    const s2 = string().min(() => arg)

    expect(await s2.test("123456")).toBe(true)
  })

  test("max", async () => {
    const arg = 5
    const s1 = string().max(arg)

    expect(await s1.test("123456")).toBe(false)
    expect(await s1.test("12345")).toBe(true)
    expect(await s1.test("1234")).toBe(true)
    expect(await s1.test("")).toBe(false)
    expect(await s1.test("1")).toBe(true)

    expect((await s1.validate("123456"))![0].message).toBe(translateMessage("string_max", [arg]))
    expect(await s1.validate("12")).toBe(undefined)

    const s2 = string().max(() => arg)

    expect(await s2.test("1")).toBe(true)
  })

  test("between", async () => {
    const arg1 = 3
    const arg2 = 5
    const s1 = string().between(arg1, arg2)

    expect(await s1.test("")).toBe(false)
    expect(await s1.test("12")).toBe(false)
    expect(await s1.test("123")).toBe(true)
    expect(await s1.test("1234")).toBe(true)
    expect(await s1.test("12345")).toBe(true)
    expect(await s1.test("123456")).toBe(false)

    expect((await s1.validate("1"))![0].message).toBe(translateMessage("string_between", [arg1, arg2]))
    expect(await s1.validate("1234")).toBe(undefined)

    const s2 = string().between(() => arg1, () => arg2)

    expect(await s2.test("12345")).toBe(true)
  })

  test("email", async () => {
    const s = string().optional().email()

    expect(await s.test("")).toBe(true)
    expect(await s.test("some email")).toBe(false)
    expect(await s.test("some@email")).toBe(false)
    expect(await s.test("some@email.com")).toBe(true)

    expect((await s.validate("a"))![0].message).toBe(translateMessage("string_email"))
    expect(await s.validate("some@email.com")).toBe(undefined)
  })

  test("url", async () => {
    const s = string().optional().url()

    expect(await s.test("google.com")).toBe(false)
    expect(await s.test("http://google.com")).toBe(true)
    expect(await s.test("https://google.com")).toBe(true)
    expect(await s.test("")).toBe(true)

    expect((await s.validate("a"))![0].message).toBe(translateMessage("string_url"))
    expect(await s.validate("http://google.com")).toBe(undefined)
  })

  test("startsWith", async () => {
    const arg = "red"
    const s1 = string().startsWith(arg)

    expect(await s1.test("blue car")).toBe(false)
    expect(await s1.test("red car")).toBe(true)

    expect((await s1.validate("a"))![0].message).toBe(translateMessage("string_starts_with", [arg]))
    expect(await s1.validate("red bus")).toBe(undefined)

    const s2 = string().startsWith(() => arg)

    expect(await s2.test("red car")).toBe(true)
  })

  test("endsWith", async () => {
    const arg = "bus"
    const s1 = string().endsWith(arg)

    expect(await s1.test("red car")).toBe(false)
    expect(await s1.test("red bus")).toBe(true)

    expect((await s1.validate("a"))![0].message).toBe(translateMessage("string_ends_with", [arg]))
    expect(await s1.validate("red bus")).toBe(undefined)

    const s2 = string().endsWith(() => arg)

    expect(await s2.test("red bus")).toBe(true)
  })

  test("includes", async () => {
    const arg = "bus"
    const s1 = string().includes(arg)

    expect(await s1.test("red car")).toBe(false)
    expect(await s1.test("red bus")).toBe(true)

    expect((await s1.validate("a"))![0].message).toBe(translateMessage("string_includes", [arg]))
    expect(await s1.validate(arg)).toBe(undefined)

    const s2 = string().includes(() => arg)

    expect(await s2.test("red bus")).toBe(true)
  })

  test("omits", async () => {
    const arg = "blue"
    const s1 = string().omits(arg)

    expect(await s1.test("blue")).toBe(false)
    expect(await s1.test("red")).toBe(true)

    expect((await s1.validate(arg))![0].message).toBe(translateMessage("string_omits", [arg]))
    expect(await s1.validate("red")).toBe(undefined)

    const s2 = string().omits(() => arg)

    expect(await s2.test("red")).toBe(true)
  })

  test("oneOf", async () => {
    const arg = ["bus", "taxi"]
    const s1 = string().oneOf(arg)

    expect(await s1.test("car")).toBe(false)
    expect(await s1.test("bus")).toBe(true)
    expect(await s1.test("taxi")).toBe(true)

    expect((await s1.validate("car"))![0].message).toBe(translateMessage("string_one_of", [arg]))
    expect(await s1.validate("bus")).toBe(undefined)

    const s2 = string().oneOf(() => arg)

    expect(await s2.test("taxi")).toBe(true)
  })

  test("noneOf", async () => {
    const arg = ["bus", "taxi"]
    const s1 = string().noneOf(arg)

    expect(await s1.test("bus")).toBe(false)
    expect(await s1.test("taxi")).toBe(false)
    expect(await s1.test("car")).toBe(true)

    expect((await s1.validate("bus"))![0].message).toBe(translateMessage("string_none_of", [arg]))
    expect(await s1.validate("car")).toBe(undefined)

    const s2 = string().noneOf(() => arg)

    expect(await s2.test("car")).toBe(true)
  })

  test("matches", async () => {
    const regex = /^red/
    const s1 = string().matches(regex)

    expect(await s1.test("blue car")).toBe(false)
    expect(await s1.test("red car")).toBe(true)

    expect((await s1.validate("blue car"))![0].message).toBe(translateMessage("string_matches", [regex]))
    expect(await s1.validate("red car")).toBe(undefined)

    const s2 = string().matches(() => regex)

    expect(await s2.test("red car")).toBe(true)
  })

  test("numeric", async () => {
    const s = string().numeric()

    expect(await s.test("")).toBe(false)
    expect(await s.test("a1")).toBe(false)
    expect(await s.test("1a")).toBe(false)
    expect(await s.test("1.0 a")).toBe(false)
    expect(await s.test("1-0")).toBe(false)
    expect(await s.test("1,0")).toBe(false)
    expect(await s.test("1'0")).toBe(false)
    expect(await s.test("1")).toBe(true)
    expect(await s.test("1.0")).toBe(true)
    expect(await s.test("111.000")).toBe(true)

    expect((await s.validate("a"))![0].message).toBe(translateMessage("string_numeric"))
    expect(await s.validate("1")).toBe(undefined)
  })

  test("alpha", async () => {
    const s = string().alpha()

    expect(await s.test("a1")).toBe(false)
    expect(await s.test("1a")).toBe(false)
    expect(await s.test("a")).toBe(true)
    expect(await s.test("A")).toBe(true)

    expect((await s.validate("1"))![0].message).toBe(translateMessage("string_alpha"))
    expect(await s.validate("a")).toBe(undefined)
  })

  test("alphaNumeric", async () => {
    const s = string().alphaNumeric()

    expect(await s.test("a1_")).toBe(false)
    expect(await s.test("1a-")).toBe(false)
    expect(await s.test("a 1")).toBe(false)
    expect(await s.test("1'0")).toBe(false)
    expect(await s.test("1")).toBe(true)
    expect(await s.test("a")).toBe(true)
    expect(await s.test("A")).toBe(true)
    expect(await s.test("a1")).toBe(true)

    expect((await s.validate("-"))![0].message).toBe(translateMessage("string_alpha_numeric"))
    expect(await s.validate("1")).toBe(undefined)
  })

  test("alphaDashes", async () => {
    const s = string().alphaDashes()

    expect(await s.test("a1")).toBe(false)
    expect(await s.test("a_")).toBe(false)
    expect(await s.test("a -")).toBe(false)
    expect(await s.test("a-")).toBe(true)
    expect(await s.test("a")).toBe(true)
    expect(await s.test("A")).toBe(true)
    expect(await s.test("-")).toBe(true)

    expect((await s.validate("_"))![0].message).toBe(translateMessage("string_alpha_dashes"))
    expect(await s.validate("-")).toBe(undefined)
  })

  test("alphaUnderscores", async () => {
    const s = string().alphaUnderscores()

    expect(await s.test("a1")).toBe(false)
    expect(await s.test("a-")).toBe(false)
    expect(await s.test("a _")).toBe(false)
    expect(await s.test("a_")).toBe(true)
    expect(await s.test("a")).toBe(true)
    expect(await s.test("A")).toBe(true)
    expect(await s.test("_")).toBe(true)

    expect((await s.validate("-"))![0].message).toBe(translateMessage("string_alpha_underscores"))
    expect(await s.validate("_")).toBe(undefined)
  })

  test("alphaNumericDashes", async () => {
    const s = string().alphaNumericDashes()

    expect(await s.test("a1_")).toBe(false)
    expect(await s.test("1a -")).toBe(false)
    expect(await s.test("a")).toBe(true)
    expect(await s.test("A")).toBe(true)
    expect(await s.test("1")).toBe(true)
    expect(await s.test("-")).toBe(true)
    expect(await s.test("a1-")).toBe(true)

    expect((await s.validate("_"))![0].message).toBe(translateMessage("string_alpha_numeric_dashes"))
    expect(await s.validate("1")).toBe(undefined)
  })

  test("alphaNumericUnderscores", async () => {
    const s = string().alphaNumericUnderscores()

    expect(await s.test("a1-")).toBe(false)
    expect(await s.test("1a _")).toBe(false)
    expect(await s.test("a")).toBe(true)
    expect(await s.test("As")).toBe(true)
    expect(await s.test("1")).toBe(true)
    expect(await s.test("_")).toBe(true)
    expect(await s.test("a1_")).toBe(true)

    expect((await s.validate("-"))![0].message).toBe(translateMessage("string_alpha_numeric_underscores"))
    expect(await s.validate("_")).toBe(undefined)
  })

  test("date", async () => {
    const s = string().date()

    expect(await s.test("2019 12 12")).toBe(false)
    expect(await s.test("2019-12-12")).toBe(true)
    expect(await s.test("2019-12-12T17:55:00")).toBe(false)
    expect(await s.test("2019-12-12+07:00")).toBe(true)
    expect(await s.test("2019-12-12Z")).toBe(true)

    expect((await s.validate("-"))![0].message).toBe(translateMessage("string_date"))
    expect(await s.validate("2019-12-12")).toBe(undefined)
  })

  test("time", async () => {
    const s = string().time()

    expect(await s.test("17 55 41")).toBe(false)
    expect(await s.test("17:55")).toBe(true)
    expect(await s.test("17:55:41")).toBe(true)
    expect(await s.test("17:55:41.127")).toBe(true)
    expect(await s.test("17:55:41+07:00")).toBe(true)
    expect(await s.test("17:55:41Z")).toBe(true)
    expect(await s.test("17:55:41.127+07:00")).toBe(true)
    expect(await s.test("17:55:41.127Z")).toBe(true)

    expect((await s.validate("-"))![0].message).toBe(translateMessage("string_time"))
    expect(await s.validate("17:55:41")).toBe(undefined)
  })

  test("dateTime", async () => {
    const s = string().dateTime()

    expect(await s.test("2019 12 12T17 55 41")).toBe(false)
    expect(await s.test("2019-12-12T17:55:41")).toBe(true)
    expect(await s.test("2019-12-12T17:55:41.123")).toBe(true)
    expect(await s.test("2019-12-12T17:55:41+07:00")).toBe(true)
    expect(await s.test("2019-12-12T17:55:41Z")).toBe(true)
    expect(await s.test("2019-12-12T17:55:41.123+07:00")).toBe(true)
    expect(await s.test("2019-12-12T17:55:41.123Z")).toBe(true)

    expect((await s.validate("-"))![0].message).toBe(translateMessage("string_date_time"))
    expect(await s.validate("2019-12-12T17:55:41")).toBe(undefined)
  })

  test("dateBefore", async () => {
    const before = new Date()
    const s1 = string().dateBefore(before)

    expect(await s1.test(before)).toBe(false)
    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test(before.toISOString())).toBe(false)
    expect(await s1.test(subDays(before, 1))).toBe(false)
    expect(await s1.test(subDays(before, 1).toISOString())).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_date_before", [before]))
    expect(await s1.validate(subDays(before, 1).toISOString())).toBe(undefined)

    const s2 = string().dateBefore(() => before)

    expect(await s2.test(subDays(before, 1).toISOString())).toBe(true)
  })

  test("dateBeforeOrSame", async () => {
    const before = new Date()
    const s1 = string().dateBeforeOrSame(before)

    expect(await s1.test(before)).toBe(false)
    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test(before.toISOString())).toBe(true)
    expect(await s1.test(subDays(before, 1))).toBe(false)
    expect(await s1.test(subDays(before, 1).toISOString())).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_date_before_or_same", [before]))
    expect(await s1.validate(subDays(before, 1).toISOString())).toBe(undefined)

    const s2 = string().dateBeforeOrSame(() => before)

    expect(await s2.test(subDays(before, 1).toISOString())).toBe(true)
  })

  test("dateAfter", async () => {
    const after = new Date()
    const s1 = string().dateAfter(after)

    expect(await s1.test(after)).toBe(false)
    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test(after.toISOString())).toBe(false)
    expect(await s1.test(addDays(after, 1))).toBe(false)
    expect(await s1.test(addDays(after, 1).toISOString())).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_date_after", [after]))
    expect(await s1.validate(addDays(after, 1).toISOString())).toBe(undefined)

    const s2 = string().dateAfter(() => after)

    expect(await s2.test(addDays(after, 1).toISOString())).toBe(true)
  })

  test("dateAfterOrSame", async () => {
    const after = new Date()
    const s1 = string().dateAfterOrSame(after)

    expect(await s1.test(after)).toBe(false)
    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test(after.toISOString())).toBe(true)
    expect(await s1.test(addDays(after, 1))).toBe(false)
    expect(await s1.test(addDays(after, 1).toISOString())).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_date_after_or_same", [after]))
    expect(await s1.validate(addDays(after, 1).toISOString())).toBe(undefined)

    const s2 = string().dateAfterOrSame(() => after)

    expect(await s2.test(addDays(after, 1).toISOString())).toBe(true)
  })

  test("dateBetween", async () => {
    const after = subDays(new Date(), 3)
    const before = addDays(new Date(), 3)
    const now = new Date()
    const s1 = string().dateBetween(after, before)

    expect(await s1.test(after)).toBe(false)
    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test(after.toISOString())).toBe(false)
    expect(await s1.test(before.toISOString())).toBe(false)
    expect(await s1.test(addDays(now, 4))).toBe(false)
    expect(await s1.test(addDays(now, 4).toISOString())).toBe(false)
    expect(await s1.test(subDays(now, 4))).toBe(false)
    expect(await s1.test(subDays(now, 4).toISOString())).toBe(false)
    expect(await s1.test(now)).toBe(false)
    expect(await s1.test(now.toISOString())).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_date_between", [after, before]))
    expect(await s1.validate(now.toISOString())).toBe(undefined)

    const s2 = string().dateBetween(() => after, () => before)

    expect(await s2.test(now.toISOString())).toBe(true)
  })

  test("dateBetween", async () => {
    const after = subDays(new Date(), 3)
    const before = addDays(new Date(), 3)
    const now = new Date()
    const s1 = string().dateBetweenOrSame(after, before)

    expect(await s1.test(after)).toBe(false)
    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test(after.toISOString())).toBe(true)
    expect(await s1.test(before.toISOString())).toBe(true)
    expect(await s1.test(addDays(now, 4))).toBe(false)
    expect(await s1.test(addDays(now, 4).toISOString())).toBe(false)
    expect(await s1.test(subDays(now, 4))).toBe(false)
    expect(await s1.test(subDays(now, 4).toISOString())).toBe(false)
    expect(await s1.test(now)).toBe(false)
    expect(await s1.test(now.toISOString())).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_date_between_or_same", [after, before]))
    expect(await s1.validate(now.toISOString())).toBe(undefined)

    const s2 = string().dateBetweenOrSame(() => after, () => before)

    expect(await s2.test(now.toISOString())).toBe(true)
  })

  test("timeBefore", async () => {
    const before = "12:00"
    const s1 = string().timeBefore(before)

    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test("13:00")).toBe(false)
    expect(await s1.test("12:00")).toBe(false)
    expect(await s1.test("11:59")).toBe(true)
    expect(await s1.test("11:00")).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_time_before", [before]))
    expect(await s1.validate("11:00")).toBe(undefined)

    const s2 = string().timeBefore(() => before)

    expect(await s2.test("11:00")).toBe(true)
  })

  test("timeBeforeOrSame", async () => {
    const before = "12:00"
    const s1 = string().timeBeforeOrSame(before)

    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test("13:00")).toBe(false)
    expect(await s1.test("12:00")).toBe(true)
    expect(await s1.test("11:59")).toBe(true)
    expect(await s1.test("11:00")).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_time_before_or_same", [before]))
    expect(await s1.validate("11:00")).toBe(undefined)

    const s2 = string().timeBeforeOrSame(() => before)

    expect(await s2.test("11:00")).toBe(true)
  })

  test("timeAfter", async () => {
    const after = "12:00"
    const s1 = string().timeAfter(after)

    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test("11:59")).toBe(false)
    expect(await s1.test("12:00")).toBe(false)
    expect(await s1.test("12:01")).toBe(true)
    expect(await s1.test("13:00")).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_time_after", [after]))
    expect(await s1.validate("13:00")).toBe(undefined)

    const s2 = string().timeAfter(() => after)

    expect(await s2.test("13:00")).toBe(true)
  })

  test("timeAfterOrSame", async () => {
    const after = "12:00"
    const s1 = string().timeAfterOrSame(after)

    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test("11:59")).toBe(false)
    expect(await s1.test("12:00")).toBe(true)
    expect(await s1.test("12:01")).toBe(true)
    expect(await s1.test("13:00")).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_time_after_or_same", [after]))
    expect(await s1.validate("13:00")).toBe(undefined)

    const s2 = string().timeAfterOrSame(() => after)

    expect(await s2.test("13:00")).toBe(true)
  })

  test("timeBetween", async () => {
    const after = "10:00"
    const before = "15:00"
    const s1 = string().timeBetween(after, before)

    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test("09:00")).toBe(false)
    expect(await s1.test("09:59")).toBe(false)
    expect(await s1.test("16:00")).toBe(false)
    expect(await s1.test("15:01")).toBe(false)
    expect(await s1.test("10:00")).toBe(false)
    expect(await s1.test("15:00")).toBe(false)
    expect(await s1.test("10:01")).toBe(true)
    expect(await s1.test("14:59")).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_time_between", [after, before]))
    expect(await s1.validate("12:00")).toBe(undefined)

    const s2 = string().timeBetween(() => after, () => before)

    expect(await s2.test("12:00")).toBe(true)
  })

  test("timeBetweenOrSame", async () => {
    const after = "10:00"
    const before = "15:00"
    const s1 = string().timeBetweenOrSame(after, before)

    expect(await s1.test("foo")).toBe(false)
    expect(await s1.test("09:00")).toBe(false)
    expect(await s1.test("09:59")).toBe(false)
    expect(await s1.test("16:00")).toBe(false)
    expect(await s1.test("15:01")).toBe(false)
    expect(await s1.test("10:00")).toBe(true)
    expect(await s1.test("15:00")).toBe(true)
    expect(await s1.test("10:01")).toBe(true)
    expect(await s1.test("14:59")).toBe(true)

    expect((await s1.validate("-"))![0].message).toBe(translateMessage("string_time_between_or_same", [after, before]))
    expect(await s1.validate("12:00")).toBe(undefined)

    const s2 = string().timeBetweenOrSame(() => after, () => before)

    expect(await s2.test("12:00")).toBe(true)
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("toDefault", async () => {
    const newString = "foo"
    const s1 = string().toDefault(newString)

    expect(await s1.sanitize(null)).toBe(newString)
    expect(await s1.sanitize(undefined)).toBe(newString)
    expect(await s1.sanitize(1)).toBe(newString)
    expect(await s1.sanitize("")).toBe("")
    expect(await s1.sanitize("bar")).toBe("bar")

    const s2 = string().toDefault(() => newString)

    expect(await s2.sanitize(null)).toBe(newString)
  })

  test("toUpperCase", async () => {
    const s = string().toUpperCase()

    expect(await s.sanitize("foo")).toBe("FOO")
  })

  test("toLowerCase", async () => {
    const s = string().toLowerCase()

    expect(await s.sanitize("FOO")).toBe("foo")
  })

  test("toCapitalized", async () => {
    const s = string().toCapitalized()

    expect(await s.sanitize("foo")).toBe("Foo")
    expect(await s.sanitize("foo bar")).toBe("Foo bar")
  })

  test("toCamelCase", async () => {
    const s = string().toCamelCase()

    expect(await s.sanitize("foo")).toBe("foo")
    expect(await s.sanitize("foo bar")).toBe("fooBar")
    expect(await s.sanitize("foo_bar")).toBe("fooBar")
    expect(await s.sanitize("foo-bar")).toBe("fooBar")
    expect(await s.sanitize("FOO BAR")).toBe("fooBar")
  })

  test("toSnakeCase", async () => {
    const s = string().toSnakeCase()

    expect(await s.sanitize("foo")).toBe("foo")
    expect(await s.sanitize("foo bar")).toBe("foo_bar")
    expect(await s.sanitize("fooBar")).toBe("foo_bar")
    expect(await s.sanitize("foo-bar")).toBe("foo_bar")
    expect(await s.sanitize("FOO BAR")).toBe("foo_bar")
  })

  test("toKebabCase", async () => {
    const s = string().toKebabCase()

    expect(await s.sanitize("foo")).toBe("foo")
    expect(await s.sanitize("foo bar")).toBe("foo-bar")
    expect(await s.sanitize("foo_bar")).toBe("foo-bar")
    expect(await s.sanitize("fooBar")).toBe("foo-bar")
    expect(await s.sanitize("FOO BAR")).toBe("foo-bar")
  })

  test("toConstantCase", async () => {
    const s = string().toConstantCase()

    expect(await s.sanitize("foo")).toBe("FOO")
    expect(await s.sanitize("foo bar")).toBe("FOO_BAR")
    expect(await s.sanitize("foo_bar")).toBe("FOO_BAR")
    expect(await s.sanitize("foo-bar")).toBe("FOO_BAR")
    expect(await s.sanitize("FOO BAR")).toBe("FOO_BAR")
  })

  test("toTrimmed", async () => {
    const s = string().toTrimmed()

    expect(await s.sanitize("   foo  ")).toBe("foo")
    expect(await s.sanitize("   foo   bar   ")).toBe("foo   bar")
  })

  ////////////////////////////////////////////////////////////////////////////////

  test("complex example", async () => {
    const arg1 = "foo"
    const arg2 = "bar"
    const arg3 = "yolo"
    const arg4 = "swag"
    const s = string()
      .startsWith(arg1)
      .endsWith(arg2)
      .includes(arg3)
      .omits(arg4)

    expect(await s.test("foo yolo")).toBe(false)
    expect(await s.test("yolo bar")).toBe(false)
    expect(await s.test("goo yolo bar")).toBe(false)
    expect(await s.test("foo yolo gar")).toBe(false)
    expect(await s.test("foo golo bar")).toBe(false)
    expect(await s.test("foo yolo swag bar")).toBe(false)
    expect(await s.test("foo yolo bar")).toBe(true)

    expect((await s.validate(arg4))![0].message).toBe(translateMessage("string_starts_with", [arg1]))
    expect((await s.validate(arg4))![1].message).toBe(translateMessage("string_ends_with", [arg2]))
    expect((await s.validate(arg4))![2].message).toBe(translateMessage("string_includes", [arg3]))
    expect((await s.validate(arg4))![3].message).toBe(translateMessage("string_omits", [arg4]))
  })

  test("or", async () => {
    const s1 = string().min(3).or(string().equals("xy"))

    expect(await s1.test("1")).toBe(false)
    expect(await s1.test("123")).toBe(true)
    expect(await s1.test("xy")).toBe(true)

    const errors1 = (await s1.validate("1"))!

    expect(errors1!.length).toBe(2)
    expect(errors1[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors1[0].link).toBe(undefined)
    expect(errors1[1].message).toBe(translateMessage("string_equals", ["xy"]))
    expect(errors1[1].link).toBe("or")

    expect(await s1.validate("123")).toBe(undefined)
    expect(await s1.validate("xy")).toBe(undefined)

    const s2 = string().min(3).or(string().equals("xy").or(string().equals("yx")))

    expect(await s2.test("1")).toBe(false)
    expect(await s2.test("123")).toBe(true)
    expect(await s2.test("xy")).toBe(true)
    expect(await s2.test("yx")).toBe(true)

    const errors2 = (await s2.validate("1"))!

    expect(errors2!.length).toBe(3)
    expect(errors2[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors2[0].link).toBe(undefined)
    expect(errors2[1].message).toBe(translateMessage("string_equals", ["xy"]))
    expect(errors2[1].link).toBe("or")
    expect(errors2[2].message).toBe(translateMessage("string_equals", ["yx"]))
    expect(errors2[2].link).toBe("or.or")

    expect(await s2.validate("123")).toBe(undefined)
    expect(await s2.validate("xy")).toBe(undefined)
    expect(await s2.validate("yx")).toBe(undefined)
  })

  test("and", async () => {
    const s1 = string().min(2).and(string().equals("xy"))

    expect(await s1.test("1")).toBe(false)
    expect(await s1.test("12")).toBe(false)
    expect(await s1.test("xy")).toBe(true)

    const errors1 = (await s1.validate("1"))!

    expect(errors1.length).toBe(2)
    expect(errors1[0].message).toBe(translateMessage("string_min", [2]))
    expect(errors1[0].link).toBe(undefined)
    expect(errors1[1].message).toBe(translateMessage("string_equals", ["xy"]))
    expect(errors1[1].link).toBe("and")

    expect(await s1.validate("xy")).toBe(undefined)

    const s2 = string().min(2).and(string().equals("xyz").and(string().length(3)))

    expect(await s2.test("1")).toBe(false)
    expect(await s2.test("xyz")).toBe(true)

    const errors2 = (await s2.validate("1"))!

    expect(errors2.length).toBe(3)
    expect(errors2[0].message).toBe(translateMessage("string_min", [2]))
    expect(errors2[0].link).toBe(undefined)
    expect(errors2[1].message).toBe(translateMessage("string_equals", ["xyz"]))
    expect(errors2[1].link).toBe("and")
    expect(errors2[2].message).toBe(translateMessage("string_length", [3]))
    expect(errors2[2].link).toBe("and.and")

    expect(await s2.validate("xyz")).toBe(undefined)
  })

  test("dedupe errors", async () => {
    const s = string()
      .min(2)
      .or(
        string().min(2).or(
          string().min(2),
        ),
      )
      .or(
        string().min(2),
      )
      .and(
        string().min(2).and(
          string().min(2),
        ),
      )
      .and(string().min(2))

    const errors1 = (await s.validate(""))!

    expect(errors1.length).toBe(2)
    expect(errors1[0].message).toBe(translateMessage("string_required"))
    expect(errors1[1].message).toBe(translateMessage("string_min", [2]))

    const errors2 = (await s.validate("a"))!

    expect(errors2.length).toBe(1)
    expect(errors2[0].message).toBe(translateMessage("string_min", [2]))

    expect(await s.validate("ab")).toBe(undefined)
  })

  test("and or", async () => {
    const s = string().min(3).or(string().min(2)).and(string().equals("xy"))

    expect(await s.test("1")).toBe(false)
    expect(await s.test("xy")).toBe(true)

    const errors1 = (await s.validate("1"))!

    expect(errors1.length).toBe(3)
    expect(errors1[0].message).toBe(translateMessage("string_min", [3]))
    expect(errors1[0].link).toBe(undefined)
    expect(errors1[1].message).toBe(translateMessage("string_min", [2]))
    expect(errors1[1].link).toBe("or")
    expect(errors1[2].message).toBe(translateMessage("string_equals", ["xy"]))
    expect(errors1[2].link).toBe("and")

    expect(await s.validate("xy")).toBe(undefined)

    const errors2 = (await s.validate("12"))!

    expect(errors2.length).toBe(1)
    expect(errors2[0].message).toBe(translateMessage("string_equals", ["xy"]))
    expect(errors2[0].link).toBe("and")

    const errors3 = (await s.validate("123"))!

    expect(errors3.length).toBe(1)
    expect(errors3[0].message).toBe(translateMessage("string_equals", ["xy"]))
    expect(errors3[0].link).toBe("and")
  })

  test("and or at the same level", async () => {
    const s = string().min(4)
      .or(string().min(3))
      .or(string().min(2))
      .and(string().endsWith("a"))

    const errors = (await s.validate("b"))!

    expect(errors.length).toBe(4)
    expect(errors[0].message).toBe(translateMessage("string_min", [4]))
    expect(errors[0].link).toBe(undefined)
    expect(errors[1].message).toBe(translateMessage("string_min", [3]))
    expect(errors[1].link).toBe("or")
    expect(errors[2].message).toBe(translateMessage("string_min", [2]))
    expect(errors[2].link).toBe("or")
    expect(errors[3].message).toBe(translateMessage("string_ends_with", ["a"]))
    expect(errors[3].link).toBe("and")
  })

  test("customValidation", async () => {
    const s = string().customValidator("too short", (value) => value.length > 2)

    expect(await s.test("12")).toBe(false)
    expect(await s.test("123")).toBe(true)

    expect((await s.validate("12"))![0].message).toBe("too short")
    expect(await s.validate("123")).toBe(undefined)
  })

  test("customSanitizer", async () => {
    const s = string().customSanitizer((value) => value.toString())

    expect(await s.sanitize(1)).toBe("1")
  })

  test("sanitize", async () => {
    const s = string().toTrimmed().length(2)

    expect(await s.sanitize(" 12 ")).toEqual("12")
  })

  test("sanitizeAndTest", async () => {
    const s = string().toTrimmed().length(2)

    expect(await s.sanitizeAndTest(" 12 ")).toEqual([true, "12"])
  })

  test("validate", async () => {
    const s = string().min(2)
    const errors = (await s.validate("1"))!

    expect(errors.length).toBe(1)
    expect(errors[0].message).toBe(translateMessage("string_min", [2]))

    expect(await s.validate("12")).toBe(undefined)
  })

  test("sanitizeAndValidate", async () => {
    const s = string().length(2).toTrimmed()
    const [errors1, value1] = await s.sanitizeAndValidate("   1   ")

    expect(errors1!.length).toBe(1)
    expect(errors1![0].message).toBe(translateMessage("string_length", [2]))
    expect(value1).toEqual("1")

    const [errors2, value2] = await s.sanitizeAndValidate("   12   ")
    expect(errors2).toBe(undefined)
    expect(value2).toEqual("12")
  })
})
