import { twMerge } from "tailwind-merge"
import type { ClassNameValue } from "../types/build"

export default (...classes: (ClassNameValue | false | undefined)[]) => {
  return twMerge(
    ...classes.map((className) => {
      if (!className) return ""
      const classList: string[] = []
      if (typeof className === "string") {
        classList.push(className)
      } else if (Array.isArray(className)) {
        const list = className.filter(item => item !== undefined) as string[]
        classList.push(...list)
      } else if (typeof className === "object") {
        for (const [key, value] of Object.entries(className)) {
          if (value) classList.push(key)
        }
      }
      return classList.join(" ")
    })
  )
}
