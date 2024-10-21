import { INHERITED_DISABLED } from "../utils/injection-keys"
import { computed, inject, provide, toRef, unref } from "vue"

export default (props: { disabled?: boolean }) => {
  const disabled = toRef(props, "disabled")
  const inheritedDisabled = inject(INHERITED_DISABLED, false)
  const _disabled = computed(() => disabled.value ?? unref(inheritedDisabled))
  provide(INHERITED_DISABLED, _disabled)
  return { disabled: _disabled }
}
