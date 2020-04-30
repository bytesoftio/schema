import { ObjectShape } from "./schemas/ObjectSchema"

export const testObjectShape = async (
  value: any,
  objectShape: ObjectShape<any> | undefined,
): Promise<boolean> => {
  if ( ! objectShape) return true

  for (const key in objectShape) {
    const keyValue = value[key]
    const shapeDefinitions = objectShape[key]

    if (shapeDefinitions && ! await shapeDefinitions.test(keyValue)) {
      return false
    }
  }

  return true
}