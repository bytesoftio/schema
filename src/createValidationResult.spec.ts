import { createValidationResult} from "./index"
import { string } from "./factories/string"
import { object } from "./factories/object"

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

    expect(await s.testAsync({ foo: "1" })).toBe(false)
    expect(await s.testAsync({ foo: "12" })).toBe(true)
    expect(await s.testAsync({ foo: "123" })).toBe(true)
    expect(await s.testAsync({ bar: "1" })).toBe(false)
    expect(await s.testAsync({ bar: "12" })).toBe(true)
    expect(await s.testAsync({ bar: "123" })).toBe(true)

    const errors = (await s.validateAsync({ foo: "1" }))!

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
