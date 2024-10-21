import { ref } from "vue"
import { useState } from "#imports"

export default () => {
  const startZIndex = 100

  const zIndexList = useState<number[]>("v-zindex-list", () => [])
  const zIndexCurrent = useState<number>("v-zindex-current")

  const zIndex = ref<number>()

  const updateZIndex = () => {
    releaseZIndex()
    if (zIndexCurrent.value === undefined) {
      zIndexCurrent.value = startZIndex
    } else {
      zIndexCurrent.value++
    }
    zIndex.value = zIndexCurrent.value
    zIndexList.value.push(zIndex.value)
  }

  const releaseZIndex = () => {
    if (zIndex.value === undefined) return
    const index = zIndexList.value.indexOf(zIndex.value)
    if (index !== -1) zIndexList.value.splice(index, 1)
    if (zIndex.value === zIndexCurrent.value) {
      zIndexCurrent.value = zIndexList.value[zIndexList.value.length - 1]
    }
    zIndex.value = undefined
  }

  return {
    zIndex,
    updateZIndex,
    releaseZIndex
  }
}
