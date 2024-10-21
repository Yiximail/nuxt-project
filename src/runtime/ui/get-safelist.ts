import ui from "./index"

const getMatchList = (item: Record<string, unknown>) => {
  const matchList: string[] = []
  for (const key in item) {
    const value = item[key]
    if (typeof value === "string") {
      const list = value.split(" ").filter((v) => v.includes("{color}"))
      matchList.push(...list)
    } else {
      matchList.push(...getMatchList(value as Record<string, unknown>))
    }
  }
  return matchList
}

export default (colors: string[]) => {
  if (!Array.isArray(colors)) return []
  const colorRegex = `(${colors.join("|")})`
  const matchList = Array.from(new Set(getMatchList(ui)))
  const list: { pattern: string; variants: string[] }[] = []
  for (const className of matchList) {
    let count = 0
    let last = -1
    for (let i = 0; i < className.length; i += 1) {
      if (className[i] === "[") {
        count += 1
      } else if (className[i] === "]") {
        count -= 1
      } else if (className[i] === ":" && count === 0) {
        last = i
      }
    }
    const variant = last === -1 ? undefined : className.slice(0, last)
    const pattern = className.slice(last + 1)
    const item = list.find((item) => item.pattern === pattern)
    if (item) {
      if (!variant || item.variants.includes(variant)) continue
      item.variants = [...item.variants, variant]
    } else {
      list.push({ pattern, variants: variant ? [variant] : [] })
    }
  }
  const safelist = list
    .map((item) => {
      if (/\[.*\{color\}.*\]/.test(item.pattern)) {
        const list = colors.map((color) => [
          ...item.variants.map(
            (variant) => `${variant}:${item.pattern.replace("{color}", color)}`
          ),
          item.pattern.replace("{color}", color)
        ])
        return list
      } else {
        const list = item.pattern.split("{color}")
        const escaped = list.map((item) => item.replace(/[[\]]/g, "\\$&"))
        const pattern = new RegExp(escaped.join(colorRegex))
        return { pattern, variants: item.variants }
      }
    })
    .flat(2)
    .filter((item) => item)
  return safelist
}
