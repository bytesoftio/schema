import { joinPath, mapKeysDeep, mapValuesDeep } from "./helpers"

describe("helpers", () => {
  test("mapValuesDeep", () => {
    const noop = () => null
    const mapped = mapValuesDeep({ foo: 0, bar: { baz: 0, yolo: [0, 0] }, noop }, (value) => ++value)

    expect(mapped).toEqual({ foo: 1, bar: { baz: 1, yolo: [1, 1] }, noop })
  })

  test("mapKeysDeep", () => {
    const mapped = mapKeysDeep({ k1: { k2: [0] }, k3: 0 }, (value, key) => `${key}k`)

    expect(mapped).toEqual({ k1k: { k2k: [0] }, k3k: 0 })
  })

  test("joinPath", () => {
    const joinedPath = joinPath("foo", undefined, "bar")

    expect(joinedPath).toBe("foo.bar")
  })
})