import type { DeepPartial } from "../types/build"

const cloneDeepUi = <T extends Record<string, unknown>>(target: T): T => {
  const result = { ...target }
  for (const key in result) {
    if (typeof result[key] !== "object") continue
    Reflect.set(result, key, cloneDeepUi(result[key] as Record<string, unknown>))
  }
  return result
}

const uiMerge = <T extends Record<string, unknown>>(
  target: T,
  source?: DeepPartial<T>,
  strategy: "merge" | "replace" = "merge"
): T => {
  const result = cloneDeepUi(target)
  if (!source) return result
  for (const key in result) {
    if (!source[key]) continue
    const resultType = typeof result[key]
    const sourceType = typeof source[key]
    if (resultType === "object" && sourceType === "object") {
      const obj = uiMerge(
        result[key] as Record<string, unknown>,
        source[key] as DeepPartial<typeof result>,
        strategy
      )
      Reflect.set(result, key, obj)
    } else if (resultType === "string" && sourceType === "string") {
      if (strategy === "merge") {
        const value = `${result[key]} ${source[key]}`.replace(/\s+/g, " ").trim()
        Reflect.set(result, key, value)
      } else {
        Reflect.set(result, key, source[key])
      }
    } else if (!result[key] && source[key]) {
      if (typeof source[key] === "object") {
        const obj = cloneDeepUi(source[key] as Record<string, unknown>)
        Reflect.set(result, key, obj)
      } else {
        Reflect.set(result, key, source[key])
      }
    }
  }
  for (const key of Object.keys(source).filter(
    (key) => !Object.keys(result).includes(key)
  )) {
    if (typeof source[key] === "object") {
      const obj = cloneDeepUi(source[key] as Record<string, unknown>)
      Reflect.set(result, key, obj)
    } else {
      Reflect.set(result, key, source[key])
    }
  }
  return result
}

export default uiMerge
