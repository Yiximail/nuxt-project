import type { ProviderGetImage } from "@nuxt/image"

export const getImage: ProviderGetImage = (src, { modifiers = {} } = {}) => {
  let operations = ""
  if (modifiers.risize) {
    if (typeof modifiers.reisize === "string") {
      operations += `resize,${modifiers.resize}`
    } else if (Object.keys(modifiers.resize).length > 0) {
      operations += "resize"
      for (const key in modifiers.resize) {
        operations += `,${key}_${modifiers.resize[key]}`
      }
    }
  } else if (modifiers.width || modifiers.height) {
    operations += "resize"
    if (modifiers.width) operations += `,w_${modifiers.width}`
    if (modifiers.height) operations += `,h_${modifiers.height}`
  }
  if (!operations) return { url: src }

  return {
    url: `${src}?x-oss-process=image/${operations}`
  }
}
