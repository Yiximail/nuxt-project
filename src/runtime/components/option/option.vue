<template>
  <span class="hidden" />
</template>

<script setup lang="ts">
import { SELECT_OPTIONS_INJECTION } from "../../utils/injection-keys"
import { onBeforeUnmount, inject } from "vue"

import type { ComponentSlot, SelectValue, SelectOption } from "../../types"

const props = defineProps<{
  /** 标签 */
  label?: string
  /** 值 */
  value?: SelectValue
  /** 选项 */
  option?: SelectOption
}>()

const slots = defineSlots<{
  default:() => unknown
}>()

const { addOption, removeOption } = inject(SELECT_OPTIONS_INJECTION)!

let defaultText = ""

if (props.option) {
  addOption(props.option)
} else {
  const defaultContent = slots.default?.() as ComponentSlot
  if (typeof defaultContent?.[0]?.children === "string") {
    defaultText = defaultContent[0].children.trim() as string
  }
  const la = props.label ?? defaultText
  const va = props.value ?? defaultText
  addOption({ label: la, value: va })
}

onBeforeUnmount(() => {
  if (props.option) return removeOption(props.option)
  const la = props.label ?? defaultText
  const va = props.value ?? defaultText
  removeOption({ label: la, value: va })
})
</script>
