import { createValidationResult, object, string } from "./index"

describe("createValidationResult", () => {
  it("creates result", async () => {
    const s = object({
      foo: string().min(3)
        .or(string().min(2)),
    })
      .or(object({
        bar: string().min(3)
          .or(string().min(2)),
      }))
      .or(object({
        foo: string().min(4)
          .or(string().min(6)
            .or(string().min(7)))
          .or(string().min(8)),
      }))

    expect(await s.test({ foo: "1" })).toBe(false)
    expect(await s.test({ foo: "12" })).toBe(true)
    expect(await s.test({ foo: "123" })).toBe(true)
    expect(await s.test({ bar: "1" })).toBe(false)
    expect(await s.test({ bar: "12" })).toBe(true)
    expect(await s.test({ bar: "123" })).toBe(true)

    const errors = (await s.validate({ foo: "1" }))!

    const expectedErrors = {
      "foo": [
        "Must be at least \"3\" characters long",
        "Must be at least \"2\" characters long",
        "Must be at least \"4\" characters long",
        "Must be at least \"6\" characters long",
        "Must be at least \"7\" characters long",
        "Must be at least \"8\" characters long",
      ],
      "self": [
        "Unknown object key \"foo\"",
        "Missing object key \"bar\"",
      ],
      "bar": [
        "Must be a string",
      ],
    }

    expect(createValidationResult(errors)).toEqual(expectedErrors)
  })
})