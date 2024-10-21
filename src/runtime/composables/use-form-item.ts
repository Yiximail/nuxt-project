import { FORM_ITEM_INJECTION } from "../utils/injection-keys"
import { onBeforeUnmount, onMounted, ref, inject } from "vue"
import guid from "../utils/guid"

import type { ValidateOptions, FormTrigger } from "../types"

export default (
  validate: (options: ValidateOptions) => Promise<string | undefined>,
  active?: () => void
) => {
  const validating = ref(false)
  const formItem = inject(FORM_ITEM_INJECTION, undefined)
  if (!formItem) return { validating }

  const id = guid()
  const formEmits = (event: FormTrigger) => {
    switch (event) {
      case "blur":
      case "safe-blur":
      case "change":
      case "safe-change":
        validating.value = true
        break
    }

    formItem.emits(event)
  }
  const formValidate = async (options: ValidateOptions) => {
    if (options.type === "validate") validating.value = true
    if (!validating.value) return

    return validate(options)
  }
  const resetValidate = () => {
    validating.value = false
  }

  onMounted(() => {
    formItem.setItem({ id, validate: formValidate, resetValidate, active })
  })
  onBeforeUnmount(() => {
    formItem.removeItem(id)
  })

  return { validating, formEmits }
}
