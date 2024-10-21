import { INHERITED_SIZE } from "../utils/injection-keys"
import { computed, inject, provide, toRef, unref } from "vue"

import type { Size } from "../types"

export default (props: { size?: Size }) => {
  const size = toRef(props, "size")
  const inheritedSize = inject(INHERITED_SIZE, "md")
  const _size = computed<Size>(() => size?.value ?? unref(inheritedSize))
  provide(INHERITED_SIZE, _size)
  return { size: _size }
}
