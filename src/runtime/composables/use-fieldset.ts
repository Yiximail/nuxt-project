import { FIELDSET_INJECTION } from "../utils/injection-keys"
import { computed, inject } from "vue"

import type { FormValue } from "../types"
import type { Ref } from "vue"

export default ({
  value,
  hover,
  focus,
  disabled
}: {
  value?: Ref<FormValue>
  hover?: Ref<boolean>
  focus?: Ref<boolean>
  disabled?: Ref<boolean>
}) => {
  const fieldsetInjection = inject(FIELDSET_INJECTION, undefined)

  const isEmpty = (value: FormValue) => {
    switch (true) {
      case value === undefined:
      case value === null:
      case typeof value === "number" && isNaN(value):
      case value === "":
      case Array.isArray(value) &&
        !value.filter((item) => item !== undefined && item !== null).length:
        return true
      default:
        return false
    }
  }

  const fieldsetAttrs = computed(() => {
    return {
      "data-is-active": !isEmpty(value?.value) ? "true" : "false",
      "data-is-disabled": disabled?.value ? "true" : "false",
      "data-is-hover": hover?.value ? "true" : "false",
      "data-is-focus": focus?.value ? "true" : "false"
    }
  })

  return {
    fieldsetContentClass: fieldsetInjection?.contentClass,
    fieldsetAttrs,
    fieldsetContainer: fieldsetInjection?.container
  }
}
